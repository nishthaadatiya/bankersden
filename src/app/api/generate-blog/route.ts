import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Blog from '@/models/Blog';
import { generateBlogData } from '@/lib/gemini-blog';

export const dynamic = 'force-dynamic';

const TOPICS = [
  "Stock Market Trends",
  "Personal Finance Tips",
  "Loans & Credit Score",
  "Mutual Funds & Investments",
  "Inflation & Economy",
  "Banking & Fintech",
  "Government Schemes (India)"
];

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Optional: Protect the route using a secret key
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // You can also pass the secret via query param depending on how Vercel cron is configured
      const url = new URL(request.url);
      if (url.searchParams.get('secret') !== cronSecret) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    await connectDB();

    // Select a random topic
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

    // Generate blog data
    let blogData;
    try {
      blogData = await generateBlogData(randomTopic);
    } catch (e) {
      console.error("Gemini failed, trying one more time...", e);
      // Simple retry logic
      blogData = await generateBlogData(randomTopic);
    }

    if (!blogData || !blogData.title || !blogData.content) {
      return NextResponse.json({ error: 'Failed to generate valid blog content' }, { status: 500 });
    }

    // Generate slug and handle duplicates
    let slug = generateSlug(blogData.title);
    let existingBlog = await Blog.findOne({ slug });
    let counter = 1;
    
    while (existingBlog) {
      const newSlug = `${slug}-${counter}`;
      existingBlog = await Blog.findOne({ slug: newSlug });
      if (!existingBlog) {
        slug = newSlug;
        break;
      }
      counter++;
    }

    const newBlog = new Blog({
      title: blogData.title,
      slug: slug,
      content: blogData.content,
      metaDescription: blogData.metaDescription,
      tags: blogData.tags,
      category: blogData.category,
      readTime: blogData.readTime,
    });

    await newBlog.save();

    return NextResponse.json({ message: 'Blog generated successfully', blog: newBlog }, { status: 201 });
  } catch (error: any) {
    console.error('Error generating blog:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
