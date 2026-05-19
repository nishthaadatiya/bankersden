import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  tags: string[];
  category: string;
  createdAt: Date;
  readTime: string;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    metaDescription: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    readTime: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent re-compilation of the model if it already exists
export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
