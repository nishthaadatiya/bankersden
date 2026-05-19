import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Query from '@/models/Query';
import { authenticateAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Fetch all queries, sorted by newest first
    const queries = await Query.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      queries
    });

  } catch (error) {
    console.error('Error fetching admin queries:', error);
    return NextResponse.json({ message: 'Failed to fetch queries' }, { status: 500 });
  }
}
