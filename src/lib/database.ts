import mongoose from 'mongoose';
import dns from 'dns';

// Configure DNS to prevent Windows querySrv ECONNREFUSED when resolving Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (e) {}

const getMongoURI = () => process.env.MONGODB_URI || '';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  const uri = getMongoURI();
  if (!uri) {
    throw new Error('❌ MONGODB_URI is not defined in your environment variables');
  }

  const safeURI = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  const dbName = uri.split('/').pop()?.split('?')[0] || 'unknown';

  // Already connected — reuse the cached connection
  if (cached.conn) {
    const state = cached.conn.connection.readyState;
    const stateLabel = ['disconnected', 'connected', 'connecting', 'disconnecting'][state] ?? 'unknown';
    console.log(`[MongoDB] ♻️  Reusing cached connection — state: ${stateLabel} | db: ${dbName}`);
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (e) {}
    console.log(`[MongoDB] 🔌 Connecting to: ${safeURI}`);
    const startTime = Date.now();

    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((m) => {
        const elapsed = Date.now() - startTime;
        const host = m.connection.host;
        console.log(`[MongoDB] ✅ Connected — host: ${host} | db: ${dbName} | took: ${elapsed}ms`);
        return m;
      })
      .catch((err) => {
        cached.promise = null; // allow retry on next call

        console.error(`[MongoDB] ❌ Connection FAILED`);
        console.error(`[MongoDB]    URI   : ${safeURI}`);
        console.error(`[MongoDB]    Error : ${err.message}`);

        if (err.code === 'ECONNREFUSED' || err.syscall === 'querySrv') {
          console.error(`[MongoDB] 💡 Fix  : Go to MongoDB Atlas → Network Access → Add your IP address`);
          console.error(`[MongoDB]           Or allow all IPs with 0.0.0.0/0 for development`);
        }

        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;