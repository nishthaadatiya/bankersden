import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Admin from '@/models/Admin';
import AdminSession from '@/models/AdminSession';
import { generateToken, AdminPayload } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body as { username: string; password: string };

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find admin by username OR email (flexible login)
    const admin = await Admin.findOne({
      $or: [
        { username: username.toLowerCase().trim() },
        { email: username.toLowerCase().trim() },
      ],
    });

    if (!admin) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    if (!admin.isActive) {
      return NextResponse.json({ message: 'Account is disabled.' }, { status: 403 });
    }

    // Verify password against hashed value in DB
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // Build token payload
    const payload: AdminPayload = {
      adminId: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };

    const token = generateToken(payload);

    // ── Persist session in MongoDB ───────────────────────────────────────────
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Sessions expire in 24 hours (matches JWT)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await AdminSession.create({
      adminId: admin._id,
      username: admin.username,
      email: admin.email,
      ipAddress,
      userAgent,
      expiresAt,
    });

    // ── Update lastLoginAt on the admin record ───────────────────────────────
    await Admin.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() });

    return NextResponse.json({
      token,
      admin: {
        id: admin._id.toString(),
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 });
  }
}