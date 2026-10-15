import mongoose from 'mongoose';

const whatsAppOtpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '5m' }, // Auto-delete document after 5 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.WhatsAppOtp ||
  mongoose.model('WhatsAppOtp', whatsAppOtpSchema);
