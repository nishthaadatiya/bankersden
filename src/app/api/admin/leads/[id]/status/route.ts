import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Lead from '@/models/Lead';
import { authenticateAdmin } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await authenticateAdmin(request);
  if (admin instanceof Response) return admin;

  try {
    const { status } = await request.json();
    
    if (!['active', 'processing', 'completed'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const lead = await Lead.findByIdAndUpdate(
      params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!lead) {
      return NextResponse.json(
        { message: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Status updated successfully',
      lead 
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}