import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Query from '@/models/Query';
import { authenticateAdmin } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id } = params;

    await connectDB();
    
    const query = await Query.findByIdAndUpdate(
      id,
      {
        status: data.status,
        adminResponse: data.adminResponse,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!query) {
      return NextResponse.json({ message: 'Query not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      query
    });

  } catch (error) {
    console.error('Error updating query:', error);
    return NextResponse.json({ message: 'Failed to update query' }, { status: 500 });
  }
}
