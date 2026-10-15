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

    // 1. Try to find user by googleId (primary — linked users)
    let user = await User.findOne({ googleId });

    // 2. Fallback: find by googleEmail or email (for users who were created
    //    via the old Google-only flow before this migration)
    if (!user) {
      user = await User.findOne({
        $or: [
          { googleEmail: email!.toLowerCase() },
          { email: email!.toLowerCase() },
        ],
      });

      if (user && user.phone) {
        // Existing user found by email match — backfill googleId so future
        // logins use the fast path. Only do this if they already have a phone
        // (meaning they went through WhatsApp verification at some point).
        user.googleId = googleId;
        user.googleEmail = email!.toLowerCase();
        user.name = name || user.name;
        user.picture = picture || user.picture;
        user.lastLoginAt = new Date();
        await user.save();
      } else if (user && !user.phone) {
        // Legacy Google-only user with no phone — backfill googleId and let
        // them in (they existed before the WhatsApp-first policy).
        user.googleId = googleId;
        user.googleEmail = email!.toLowerCase();
        user.name = name || user.name;
        user.picture = picture || user.picture;
        user.lastLoginAt = new Date();
        await user.save();
      }
    }

    // 3. No user found at all — this is a brand-new person trying Google
    //    before WhatsApp verification. Block them.
    if (!user) {
      return NextResponse.json({
        success: false,
        requiresWhatsApp: true,
        message: 'Please verify your WhatsApp number first to create your account. You can link Google for quick login afterwards.',
      });
    }

    // User found — update last login
    user.lastLoginAt = new Date();
    await user.save();

    // 4. Save session
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await UserSession.create({
      userId: user._id,
      name: user.name,
      email: user.googleEmail || user.email,
      ipAddress,
      userAgent,
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.googleEmail || user.email,
        picture: user.picture,
        phone: user.phone,
        isOnboarded: user.isOnboarded,
        googleId: user.googleId,
      },
    });

  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json({ message: 'Authentication failed' }, { status: 500 });
  }
}
