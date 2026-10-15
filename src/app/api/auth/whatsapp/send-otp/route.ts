import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import WhatsAppOtp from '@/models/WhatsAppOtp';
import WhatsAppService from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

declare global {
  var otpMemoryCache: Map<string, { otp: string; expiresAt: Date; attempts: number }> | undefined;
}

const otpCache = global.otpMemoryCache || new Map();
if (!global.otpMemoryCache) {
  global.otpMemoryCache = otpCache;
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number. Must be at least 10 digits.' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    console.log(`\n======================================================`);
    console.log(`🔑 [WHATSAPP OTP GENERATED]`);
    console.log(`📱 Recipient: +${cleanPhone}`);
    console.log(`🔐 OTP Code : ${otp}`);
    console.log(`⏰ Expires  : ${expiresAt.toLocaleTimeString()}`);
    console.log(`======================================================\n`);

    // 1. Save in memory cache
    otpCache.set(cleanPhone, { otp, expiresAt, attempts: 0 });

    // 2. Save in MongoDB if connected
    if (process.env.MONGODB_URI) {
      try {
        await connectDB();
        await WhatsAppOtp.deleteMany({ phone: cleanPhone });
        await WhatsAppOtp.create({
          phone: cleanPhone,
          otp,
          expiresAt,
          attempts: 0,
        });
      } catch (dbErr) {
        console.error('Failed to save OTP to MongoDB (memory cache active):', dbErr);
      }
    }

    // 3. Send via WhatsApp Meta Cloud API
    const whatsappService = new WhatsAppService();
    const message = `🏦 *Banker's Den Verification Code*\n\nYour login OTP is: *${otp}*\n\nValid for 5 minutes. Do not share this code with anyone.`;

    const sendResult = await whatsappService.sendMessage(cleanPhone, message);

    if (!sendResult.success) {
      console.warn('⚠️ Meta WhatsApp delivery warning:', sendResult.error);
      return NextResponse.json({
        success: true,
        message: 'OTP generated. Check console if using Meta Sandbox mode.',
        metaWarning: sendResult.error,
        debugOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to WhatsApp successfully',
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
