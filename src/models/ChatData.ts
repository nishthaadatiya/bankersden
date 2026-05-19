import mongoose from 'mongoose';

const chatDataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['paragraph', 'qa']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: function() {
      return this.type === 'paragraph';
    }
  },
  // For Q&A pairs
  question: {
    type: String,
    required: function() {
      return this.type === 'qa';
    }
  },
  answer: {
    type: String,
    required: function() {
      return this.type === 'qa';
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

chatDataSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.ChatData || mongoose.model('ChatData', chatDataSchema);