import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import WhatsAppConversation from '@/models/WhatsAppConversation';
import { authenticateAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const admin = await authenticateAdmin(request);
  if (admin instanceof Response) return admin;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { phoneNumber: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } },
        { lastMessageText: { $regex: search, $options: 'i' } },
      ];
    }

    const conversations = await WhatsAppConversation.find(filter)
      .sort({ lastUserMessageAt: -1 })
      .select('phoneNumber contactName lastMessageText lastUserMessageAt windowExpiresAt status isBotPaused unreadAdminCount step leadId')
      .lean();

    const now = new Date();
    const formatted = conversations.map((c: any) => {
      const expiresAt = new Date(c.windowExpiresAt);
      const isWindowOpen = expiresAt > now;
      const hoursRemaining = isWindowOpen
        ? ((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)).toFixed(1)
        : '0';

      return {
        ...c,
        isWindowOpen,
        hoursRemaining,
      };
    });

    const activeCount = await WhatsAppConversation.countDocuments({ status: 'active' });
    const botPausedCount = await WhatsAppConversation.countDocuments({ isBotPaused: true });

    return NextResponse.json({
      success: true,
      conversations: formatted,
      stats: {
        total: conversations.length,
        active: activeCount,
        botPaused: botPausedCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin WhatsApp conversations:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
