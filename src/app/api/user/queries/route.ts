import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Query from '@/models/Query';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.nextUrl.searchParams.get('email');
    
    if (!userEmail) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    
    const queries = await Query.find({ userEmail }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      queries
    });

  } catch (error) {
    console.error('Error fetching user queries:', error);
    return NextResponse.json({ message: 'Failed to fetch queries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.userEmail || !data.subject || !data.message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    
    const query = await Query.create({
      userEmail: data.userEmail,
      applicationNumber: data.applicationNumber,
      subject: data.subject,
      message: data.message,
    });

    return NextResponse.json({
      success: true,
      query
    });

  } catch (error) {
    console.error('Error creating user query:', error);
    return NextResponse.json({ message: 'Failed to create query' }, { status: 500 });
  }
}
