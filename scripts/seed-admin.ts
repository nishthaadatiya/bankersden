/**
 * Admin Seed Script
 * -----------------
 * Run with:  npm run seed:admin
 *
 * Creates the default admin account in MongoDB using credentials
 * from environment variables. Safe to re-run — skips if the admin
 * already exists (idempotent).
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env');
  process.exit(1);
}

if (!ADMIN_EMAIL) {
  console.error('❌  ADMIN_EMAIL is not set in .env');
  process.exit(1);
}

if (!ADMIN_PASSWORD) {
  console.error('❌  ADMIN_PASSWORD is not set in .env');
  process.exit(1);
}

// ── Admin Schema (inline so no build step needed for the seed) ─────────────
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'superadmin' },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

// ── Main ───────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱  Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI as string);
  console.log('✅  Connected.');

  const existing = await Admin.findOne({
    $or: [{ username: ADMIN_USERNAME.toLowerCase() }, { email: ADMIN_EMAIL!.toLowerCase() }],
  });

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD as string, 12);

  if (existing) {
    console.log(`ℹ️   Admin "${existing.username}" already exists. Updating password and ensuring active status...`);
    existing.password = hashedPassword;
    existing.isActive = true;
    existing.role = 'superadmin';
    await existing.save();
    console.log(`✅  Admin updated successfully!`);
  } else {
    await Admin.create({
      username: ADMIN_USERNAME.toLowerCase(),
      email: ADMIN_EMAIL!.toLowerCase(),
      password: hashedPassword,
      role: 'superadmin',
    });
    console.log(`✅  Admin created successfully!`);
  }

  console.log(`✅  Admin seeded successfully!`);
  console.log(`    Username : ${ADMIN_USERNAME}`);
  console.log(`    Email    : ${ADMIN_EMAIL!}`);
  console.log(`    Password : (hidden — set via ADMIN_PASSWORD env var)`);

  await mongoose.disconnect();
  console.log('🔌  Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
