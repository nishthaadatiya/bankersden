import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/seed
 * -------------------
 * Seeds the default admin account from environment variables.
 * Protected by SEED_SECRET so it cannot be called by random users.
 *
 * Call with: GET /api/admin/seed?secret=<SEED_SECRET>
 *
 * Safe to call multiple times — skips if admin already exists.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    const SEED_SECRET = process.env.SEED_SECRET || process.env.JWT_SECRET;

    if (!secret || secret !== SEED_SECRET) {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
    const ADMIN_EMAIL    = (process.env.ADMIN_EMAIL    || '').toLowerCase().trim();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD  || '';

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: 'ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.' },
        { status: 500 }
      );
    }

    await connectDB();

    const existing = await Admin.findOne({
      $or: [{ username: ADMIN_USERNAME }, { email: ADMIN_EMAIL }],
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: `Admin already exists. No changes made.`,
        admin: {
          username: existing.username,
          email: existing.email,
          role: existing.role,
          createdAt: existing.createdAt,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await Admin.create({
      username: ADMIN_USERNAME,
      email:    ADMIN_EMAIL,
      password: hashedPassword,
      role:     'superadmin',
    });

    return NextResponse.json({
      success: true,
      message: 'Admin seeded successfully!',
      admin: {
        username: admin.username,
        email:    admin.email,
        role:     admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, message: 'Seed failed. Check server logs.' },
      { status: 500 }
    );
  }
}
