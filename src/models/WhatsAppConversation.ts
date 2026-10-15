import mongoose from 'mongoose';

const whatsappMessageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const enquiryDataSchema = new mongoose.Schema(
  {
    employment_type: {
      type: String,
      enum: ['salaried', 'business', null],
      default: null,
    },
    gross_monthly_salary: {
      type: Number,
      default: null,
    },
    monthly_deductions: {
      type: Number,
      default: null,
    },
    business_income: {
      type: Number,
      default: null,
    },
    business_income_basis: {
      type: String,
      default: 'monthly',
    },
    existing_emi: {
      type: Boolean,
      default: null,
    },
    existing_emi_amount: {
      type: Number,
      default: null,
    },
    tax_amount: {
      type: Number,
      default: null,
    },
    tax_period: {
      type: String,
      default: 'annual',
    },
    requested_loan_amount: {
      type: Number,
      default: null,
    },
    qualification_status: {
      type: String,
      enum: ['pending', 'qualified', 'not_qualified'],
      default: 'pending',
    },
    follow_up_required: {
      type: Boolean,
      default: null,
    },
    missing_fields: [{ type: String }],
  },
  { _id: false }
);

const whatsAppConversationSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    contactName: {
      type: String,
      default: '',
    },
    lastMessageText: {
      type: String,
      default: '',
    },
    lastUserMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    windowExpiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    step: {
      type: String,
      default: 'INIT',
      // Steps: 'INIT', 'SALARIED_SALARY', 'SALARIED_DEDUCTIONS', 'SALARIED_EMI', 'SALARIED_LOAN_AMOUNT',
      //        'BUSINESS_INCOME', 'BUSINESS_EMI', 'BUSINESS_TAX', 'BUSINESS_LOAN_AMOUNT', 'COMPLETED'
    },
    enquiryData: {
      type: enquiryDataSchema,
      default: () => ({}),
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
    },
    messages: [whatsappMessageSchema],
  },
  {
    timestamps: true,
  }
);

whatsAppConversationSchema.virtual('isWindowOpen').get(function () {
  if (!this.windowExpiresAt) return false;
  return new Date() < new Date(this.windowExpiresAt);
});

export default mongoose.models.WhatsAppConversation ||
  mongoose.model('WhatsAppConversation', whatsAppConversationSchema);
