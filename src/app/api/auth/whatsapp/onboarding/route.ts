import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { phone, name } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Please enter your name' }, { status: 400 });
    }

    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const cleanName = name.trim();

    let updatedUser = {
      name: cleanName,
      phone: cleanPhone,
      isOnboarded: true,
      picture: '/chatbot-icon.png',
      email: cleanPhone ? `user_${cleanPhone.slice(-10)}@bankersdens.com` : undefined,
    };

    if (process.env.MONGODB_URI) {
      try {
        await connectDB();
        let query: any = {};
        if (cleanPhone) {
          query.phone = cleanPhone;
        }

        const dbUser = await User.findOneAndUpdate(
          query,
          {
            $set: {
              name: cleanName,
              isOnboarded: true,
              lastLoginAt: new Date(),
            },
          },
          { new: true, upsert: true }
        );

        updatedUser = {
          name: dbUser.name,
          phone: dbUser.phone || cleanPhone,
          email: dbUser.email,
          picture: dbUser.picture || '/chatbot-icon.png',
          isOnboarded: dbUser.isOnboarded,
        };
      } catch (dbErr) {
        console.error('Database error in onboarding:', dbErr);
      }
    }

    console.log(`🎉 [ONBOARDING COMPLETE] Name: ${cleanName} | Phone: +${cleanPhone}`);

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
