import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  messages: [messageSchema],

  // Extracted lead info from conversation (may be partial)
  extractedName: String,
  extractedPhone: String,
  extractedEmail: String,
  extractedLoanType: String,
  extractedLoanAmount: String,
  extractedIncome: String,
  extractedCibil: String,

  // Lead generation
  leadGenerated: {
    type: Boolean,
    default: false,
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
  },
  leadGeneratedAt: Date,

  // Intent signals detected
  intentSignals: [String],

  // Session metadata
  startedAt: {
    type: Date,
    default: Date.now,
  },
  lastActivityAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ChatSession ||
  mongoose.model('ChatSession', chatSessionSchema);
