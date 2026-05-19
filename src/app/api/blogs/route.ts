import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
