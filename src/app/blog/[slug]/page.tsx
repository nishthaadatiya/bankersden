import { notFound } from 'next/navigation';
import connectDB from '@/lib/database';
import Blog from '@/models/Blog';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  await connectDB();
  const blog = await Blog.findOne({ slug: params.slug }).lean() as any;
  
  if (!blog) {
    return { title: 'Blog Not Found' };
  }

  return {
    title: `${blog.title} | Financial Insights`,
    description: blog.metaDescription,
    keywords: blog.tags.join(', '),
  };
}

async function getBlog(slug: string) {
  await connectDB();
  const blog = await Blog.findOne({ slug }).lean();
  if (!blog) return null;
  return JSON.parse(JSON.stringify(blog));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all blogs
        </Link>

        <header className="mb-10">
          <div className="flex items-center space-x-2 text-sm text-indigo-600 font-semibold mb-4">
            <Tag className="w-4 h-4" />
            <span>{blog.category}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {blog.title}
          </h1>

          <div className="flex items-center text-gray-500 space-x-6 border-y border-gray-100 py-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-400" />
              {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-400" />
              {blog.readTime}
            </div>
          </div>
        </header>

        {/* Content Render */}
        <div 
          className="prose prose-lg prose-indigo max-w-none 
          prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
          prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-6
          prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-6
          prose-li:mb-2
          prose-strong:text-gray-900
          prose-img:rounded-2xl prose-img:shadow-md prose-img:w-full prose-img:object-cover prose-img:max-h-[500px]"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
