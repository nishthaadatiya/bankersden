import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import ChatSession from '@/models/ChatSession';
import { authenticateAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const admin = await authenticateAdmin(request);
  if (admin instanceof Response) return admin;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const leadOnly = searchParams.get('leadOnly') === 'true';

    const filter: any = {};
    if (leadOnly) filter.leadGenerated = true;

    const sessions = await ChatSession.find(filter)
      .sort({ lastActivityAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await ChatSession.countDocuments(filter);
    const leadCount = await ChatSession.countDocuments({ leadGenerated: true });

    return NextResponse.json({
      sessions,
      total,
      leadCount,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
