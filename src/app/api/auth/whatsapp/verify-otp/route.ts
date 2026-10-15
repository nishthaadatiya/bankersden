import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import WhatsAppOtp from '@/models/WhatsAppOtp';
import User from '@/models/User';
import UserSession from '@/models/UserSession';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const cleanOtp = otp.toString().trim();

    let matched = false;
    let expired = false;

    // 1. Check in-memory cache
    const cached = global.otpMemoryCache?.get(cleanPhone);
    if (cached) {
      if (new Date() > new Date(cached.expiresAt)) {
        expired = true;
      } else if (cached.otp === cleanOtp) {
        matched = true;
      } else {
        cached.attempts += 1;
      }
    }

    // 2. Check MongoDB if not matched in memory
    if (!matched && !expired && process.env.MONGODB_URI) {
      try {
        await connectDB();
        const record = await WhatsAppOtp.findOne({
          phone: cleanPhone,
          verified: false,
        }).sort({ createdAt: -1 });

        if (record) {
          if (new Date() > new Date(record.expiresAt)) {
            expired = true;
          } else if (record.otp === cleanOtp) {
            matched = true;
            await WhatsAppOtp.updateOne({ _id: record._id }, { $set: { verified: true } });
          } else {
            await WhatsAppOtp.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
          }
        }
      } catch (dbErr) {
        console.error('Error querying OTP from MongoDB:', dbErr);
      }
    }

    if (expired) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    if (!matched) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // OTP Verified! Clear from memory cache
    global.otpMemoryCache?.delete(cleanPhone);

    // 3. User check & persistence in MongoDB
    let isNewUser = true;
    let userData = {
      name: '',
      phone: cleanPhone,
      email: `user_${cleanPhone.slice(-10)}@bankersdens.com`,
      picture: '/chatbot-icon.png',
      isOnboarded: false,
      authProvider: 'whatsapp',
    };

    if (process.env.MONGODB_URI) {
      try {
        await connectDB();
        let existingUser = await User.findOne({ phone: cleanPhone });

        let currentUserId = existingUser?._id;

        if (existingUser) {
          // If name is filled and onboarded, not a new user
          if (existingUser.isOnboarded && existingUser.name && existingUser.name.trim().length > 0) {
            isNewUser = false;
          }

          existingUser.lastLoginAt = new Date();
          await existingUser.save();

          userData = {
            name: existingUser.name || '',
            phone: cleanPhone,
            email: existingUser.email || userData.email,
            picture: existingUser.picture || '/chatbot-icon.png',
            isOnboarded: existingUser.isOnboarded || false,
            authProvider: existingUser.authProvider || 'whatsapp',
          };
        } else {
          // First time user -> create in MongoDB
          isNewUser = true;
          const createdUser = await User.create({
            phone: cleanPhone,
            name: '',
            email: userData.email,
            picture: '/chatbot-icon.png',
            authProvider: 'whatsapp',
            isOnboarded: false,
            lastLoginAt: new Date(),
          });

          currentUserId = createdUser._id;

          userData = {
            name: '',
            phone: cleanPhone,
            email: createdUser.email,
            picture: createdUser.picture,
            isOnboarded: false,
            authProvider: 'whatsapp',
          };
        }

        // Save session
        if (currentUserId) {
          const ipAddress =
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';
          const userAgent = request.headers.get('user-agent') || 'unknown';
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

          await UserSession.create({
            userId: currentUserId,
            name: userData.name || `User +${cleanPhone.slice(-10)}`,
            email: userData.email,
            ipAddress,
            userAgent,
            expiresAt,
          });
        }
      } catch (dbErr) {
        console.error('Error with User document in MongoDB:', dbErr);
      }
    }

    console.log(`✅ [WHATSAPP LOGIN SUCCESSFUL] Phone: +${cleanPhone} | isNewUser: ${isNewUser}`);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      isNewUser,
      user: userData,
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
