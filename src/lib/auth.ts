import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import connectDB from './database';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AdminPayload {
  adminId: string;
  username: string;
  email: string;
  role: string;
}

// ── Token generation ─────────────────────────────────────────────────────────
export const generateToken = (payload: AdminPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// ── Token verification ───────────────────────────────────────────────────────
export const verifyToken = async (request: NextRequest): Promise<AdminPayload | null> => {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;

    // Always validate against the DB — ensures account is still active
    await connectDB();
    const admin = await Admin.findById(decoded.adminId).select('-password');

    if (!admin || !admin.isActive) return null;

    return {
      adminId: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };
  } catch {
    return null;
  }
};

// ── Route guard ──────────────────────────────────────────────────────────────
export const authenticateAdmin = async (
  request: NextRequest
): Promise<AdminPayload | Response> => {
  const admin = await verifyToken(request);
  if (!admin) {
    return Response.json({ message: 'Access denied. Invalid or expired token.' }, { status: 401 });
  }
  return admin;
};