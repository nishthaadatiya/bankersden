import Link from 'next/link';
import connectDB from '@/lib/database';
import Blog from '@/models/Blog';
import { Calendar, Clock, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Financial Blog | Market Trends & Insights',
  description: 'Stay updated with the latest in personal finance, stock market trends, and economic insights.',
};

async function getBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Financial Insights & Updates
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Expert analysis on market trends, personal finance, and the economy.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No blogs available at the moment. Please check back later.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: any) => (
              <Link key={blog._id} href={`/blog/${blog.slug}`} className="block group">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center space-x-2 text-sm text-indigo-600 font-medium mb-3">
                      <Tag className="w-4 h-4" />
                      <span>{blog.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 mb-4 flex-1">
                      {blog.metaDescription}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mt-auto">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {blog.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
