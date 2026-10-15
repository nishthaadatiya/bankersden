import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    googleEmail: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    picture: {
      type: String,
      default: '/chatbot-icon.png',
    },
    authProvider: {
      type: String,
      enum: ['google', 'whatsapp'],
      default: 'whatsapp',
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
