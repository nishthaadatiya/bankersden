import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['contact', 'loan', 'bd-partner']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'processing', 'completed'],
    default: 'active'
  },
  // Contact form fields
  full_name: {
    type: String,
    required: [true, 'Full name is required']
  },
  dateOfBirth: {
    type: Date,
    required: function() {
      return this.type === 'loan';
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please fill a valid 10-digit phone number']
  },
  category: String,
  message: String,
  
  // Loan application fields
  loanType: String,
  loanAmount: Number,
  monthlyIncome: Number,
  employmentType: String,
  companyName: String,
  workExperience: Number,
  panNumber: {
    type: String,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please fill a valid PAN number (e.g., ABCDE1234F)']
  },
  address: String,
  city: {
    type: String,
    required: function() {
      return this.type === 'loan';
    }
  },
  state: {
    type: String,
    required: function() {
      return this.type === 'loan';
    }
  },
  pincode: {
    type: String,
    match: [/^\d{6}$/, 'Please fill a valid 6-digit pincode']
  },
  
  // Additional loan-specific fields
  propertyValue: Number,
  downPayment: Number,
  carMake: String,
  carModel: String,
  carYear: Number,
  businessType: String,
  businessVintage: Number,
  educationInstitution: String,
  courseName: String,
  courseDuration: Number,
  propertyType: String,
  propertyAddress: String,
  
  // BD Partner fields
  experience: String,
  currentOccupation: String,
  whyJoin: String,
  expectedEarnings: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

leadSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);