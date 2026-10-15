import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/models/User';
import { OAuth2Client } from 'google-auth-library';

export const dynamic = 'force-dynamic';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

/**
 * POST /api/auth/google/link
 * Links a Google account to an existing WhatsApp-verified user.
 * Called from the onboarding page after WhatsApp OTP verification.
 */
export async function POST(request: NextRequest) {
  try {
    const { credential, phone } = await request.json();

    if (!credential) {
      return NextResponse.json({ error: 'Google credential is required' }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required to link accounts' }, { status: 400 });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 400 });
    }

    const { email, name, picture, sub: googleId } = payload;
    const cleanPhone = phone.replace(/\D/g, '');

    await connectDB();

    // Check if this googleId is already linked to a DIFFERENT user
    const existingGoogleUser = await User.findOne({ googleId });
    if (existingGoogleUser && existingGoogleUser.phone !== cleanPhone) {
      return NextResponse.json({
        error: 'This Google account is already linked to a different phone number. Please use a different Google account.',
      }, { status: 409 });
    }

    // Find the WhatsApp-verified user by phone
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      return NextResponse.json({
        error: 'No account found for this phone number. Please complete WhatsApp verification first.',
      }, { status: 404 });
    }

    // Link Google account
    user.googleId = googleId;
    user.googleEmail = email!.toLowerCase();
    user.name = user.name || name || '';
    user.picture = picture || user.picture;
    await user.save();

    console.log(`🔗 [GOOGLE LINKED] Phone: +${cleanPhone} → Google: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Google account linked successfully! You can now sign in with Google.',
      user: {
        name: user.name,
        email: user.googleEmail || user.email,
        picture: user.picture,
        phone: user.phone,
        isOnboarded: user.isOnboarded,
        googleId: user.googleId,
      },
    });
  } catch (error: any) {
    console.error('Google link error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to link Google account' },
      { status: 500 }
    );
  }
}
