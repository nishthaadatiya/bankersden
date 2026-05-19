import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Lead from '@/models/Lead';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.nextUrl.searchParams.get('email');
    
    if (!userEmail) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    
    // Fetch all leads associated with this email
    const applications = await Lead.find({ email: userEmail }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      applications
    });

  } catch (error) {
    console.error('Error fetching user applications:', error);
    return NextResponse.json({ message: 'Failed to fetch applications' }, { status: 500 });
  }
}
