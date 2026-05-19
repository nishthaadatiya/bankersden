import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/models/User';
import UserSession from '@/models/UserSession';
import { OAuth2Client } from 'google-auth-library';

export const dynamic = 'force-dynamic';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ message: 'Credential is required' }, { status: 400 });
    }

    // Verify the Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 400 });
    }

    const { email, name, picture, sub: googleId } = payload;

    await connectDB();

    // 1. Update or Create User
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { 
        name, 
        picture, 
        lastLoginAt: new Date() 
      },
      { upsert: true, new: true }
    );

    // 2. Save Session details
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days session

    await UserSession.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      ipAddress,
      userAgent,
      expiresAt
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });

  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json({ message: 'Authentication failed' }, { status: 500 });
  }
}
