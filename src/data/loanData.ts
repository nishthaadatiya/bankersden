// Loan data structure with specific details for each loan type
export interface LoanDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  interestRate: {
    min: number;
    max: number;
    unit: string;
  };
  loanAmount: {
    min: number;
    max: number;
    currency: string;
  };
  tenure: {
    min: number;
    max: number;
    unit: string;
  };
  processingFee: string;
  eligibility: string[];
  features: string[];
  benefits: string[];
  documents: string[];
  emiExample: {
    amount: number;
    tenure: number;
    rate: number;
    emi: number;
  };
  icon: string;
  color: string;
  category: string;
}

export const loanTypes: LoanDetails[] = [
  {
    id: 'home',
    name: 'Home Loan',
    slug: 'home-loan',
    description: 'Get your dream home with attractive interest rates and flexible repayment options. Our home loans come with competitive rates and minimal documentation.',
    interestRate: {
      min: 7.35,
      max: 11.0,
      unit: '% p.a.'
    },
    loanAmount: {
      min: 500000,
      max: 10000000,
      currency: '₹'
    },
    tenure: {
      min: 5,
      max: 30,
      unit: 'years'
    },
    processingFee: '0.5% - 1% of loan amount',
    eligibility: [
      'Age: 21-65 years',
      'Minimum income: ₹25,000/month',
      'CIBIL score: 650+',
      'Stable employment history',
      'Valid property documents'
    ],
    features: [
      'Competitive interest rates',
      'Flexible repayment tenure',
      'Pre-approved loans available',
      'Balance transfer facility',
      'Top-up loans available',
      'Online application process'
    ],
    benefits: [
      'Tax benefits under Section 24 and 80C',
      'No prepayment charges after 1 year',
      'Quick loan processing',
      'Expert guidance throughout',
      'Transparent fee structure'
    ],
    documents: [
      'Identity proof (Aadhaar/PAN)',
      'Address proof',
      'Income proof (Salary slips/Bank statements)',
      'Property documents',
      'Employment certificate',
      'Photographs'
    ],
    emiExample: {
      amount: 5000000,
      tenure: 20,
      rate: 9.5,
      emi: 46579
    },
    icon: 'Home',
    color: 'blue',
    category: 'Property'
  },
  {
    id: 'personal',
    name: 'Personal Loan',
    slug: 'personal-loan',
    description: 'Quick personal loans up to ₹25 lakhs with minimal documentation. Perfect for your immediate financial needs with instant approval.',
    interestRate: {
      min: 10.5,
      max: 24.0,
      unit: '% p.a.'
    },
    loanAmount: {
      min: 50000,
      max: 2500000,
      currency: '₹'
    },
    tenure: {
      min: 1,
      max: 5,
      unit: 'years'
    },
    processingFee: '2% - 4% of loan amount',
    eligibility: [
      'Age: 21-60 years',
      'Minimum income: ₹15,000/month',
      'CIBIL score: 650+',
      'Stable employment (6+ months)',
      'Valid bank account'
    ],
    features: [
      'Quick approval in 24 hours',
      'Minimal documentation',
      'No collateral required',
      'Flexible repayment options',
      'Online application available',
      'Instant loan disbursement'
    ],
    benefits: [
      'No security required',
      'Competitive interest rates',
      'Flexible tenure options',
      'Quick processing',
      'Transparent pricing'
    ],
    documents: [
      'Identity proof (Aadhaar/PAN)',
      'Address proof',
      'Income proof (Salary slips)',
      'Bank statements (3 months)',
      'Employment certificate',
      'Photographs'
    ],
    emiExample: {
      amount: 500000,
      tenure: 3,
      rate: 15.0,
      emi: 17333
    },
    icon: 'User',
    color: 'green',
    category: 'Personal'
  },
  {
    id: 'business',
    name: 'Business Loan',
    slug: 'business-loan',
    description: 'Fuel your business growth with flexible business loans. Get working capital and expansion funds with competitive interest rates.',
    interestRate: {
      min: 9.5,
      max: 18.0,
      unit: '% p.a.'
    },
    loanAmount: {
      min: 100000,
      max: 5000000,
      currency: '₹'
    },
    tenure: {
      min: 1,
      max: 5,
      unit: 'years'
    },
    processingFee: '1% - 3% of loan amount',
    eligibility: [
      'Business vintage: 2+ years',
      'Annual turnover: ₹10 lakhs+',
      'CIBIL score: 650+',
      'Valid business registration',
      'Bank statements (12 months)'
    ],
    features: [
      'Working capital support',
      'Business expansion funding',
      'Equipment financing',
      'Seasonal credit facilities',
      'Quick approval process',
      'Flexible repayment'
    ],
    benefits: [
      'No collateral required (up to ₹50 lakhs)',
      'Competitive interest rates',
      'Flexible repayment tenure',
      'Quick disbursement',
      'Expert business guidance'
    ],
    documents: [
      'Business registration certificate',
      'GST registration',
      'Bank statements (12 months)',
      'ITR returns (2 years)',
      'Business plan',
      'Identity proof of directors'
    ],
    emiExample: {
      amount: 2000000,
      tenure: 3,
      rate: 16.0,
      emi: 70334
    },
    icon: 'Briefcase',
    color: 'purple',
    category: 'Business'
  },
  {
    id: 'car',
    name: 'Car Loan',
    slug: 'car-loan',
    description: 'Drive your dream car with easy EMI options and quick approval. Get attractive interest rates on both new and used cars.',
    interestRate: {
      min: 7.5,
      max: 14.0,
      unit: '% p.a.'
    },
    loanAmount: {
      min: 100000,
      max: 5000000,
      currency: '₹'
    },
    tenure: {
      min: 1,
      max: 7,
      unit: 'years'
    },
    processingFee: '1% - 2% of loan amount',
    eligibility: [
      'Age: 21-65 years',
      'Minimum income: ₹20,000/month',
      'CIBIL score: 650+',
      'Valid driving license',
      'Down payment: 10-20%'
    ],
    features: [
      'Competitive interest rates',
      'Quick approval process',
      'Flexible tenure options',
      'Both new and used cars',
      'Online application',
      'Pre-approved offers'
    ],
    benefits: [
      'Lower interest rates',
      'Flexible down payment',
      'Quick processing',
      'No hidden charges',
      'Expert guidance'
    ],
    documents: [
      'Identity proof (Aadhaar/PAN)',
      'Address proof',
      'Income proof',
      'Driving license',
      'Car quotation/invoice',
      'Bank statements'
    ],
    emiExample: {
      amount: 800000,
      tenure: 5,
      rate: 11.0,
      emi: 17389
    },
    icon: 'Car',
    color: 'orange',
    category: 'Vehicle'
  },
  {
    id: 'education',
    name: 'Education Loan',
    slug: 'education-loan',
    description: 'Invest in your future with education loans for India and abroad. Get comprehensive coverage for tuition fees and living expenses.',
    interestRate: {
      min: 9.0,
      max: 14.0,
      unit: '% p.a.'
    },
    loanAmount: {
      min: 100000,
      max: 15000000,
      currency: '₹'
    },
    tenure: {
      min: 5,
      max: 15,
      unit: 'years'
    },
    processingFee: '1% - 2% of loan amount',
    eligibility: [
      'Age: 18-35 years',
      'Admission to recognized institution',
      'Indian citizen or NRI',
      'Co-borrower required',
      'Academic performance record'
    ],
    features: [
      'Covers tuition fees',
      'Living expenses included',
      'Study abroad options',
      'Moratorium period available',
      'Tax benefits under Section 80E',
      'No collateral (up to ₹7.5 lakhs)'
    ],
    benefits: [
      'Tax benefits available',
      'Moratorium during course',
      'Competitive interest rates',
      'Comprehensive coverage',
      'Flexible repayment'
    ],
    documents: [
      'Admission letter',
      'Fee structure',
      'Academic records',
      'Identity proof',
      'Income proof (co-borrower)',
      'Property documents (if required)'
    ],
    emiExample: {
      amount: 1000000,
      tenure: 10,
      rate: 12.0,
      emi: 14347
    },
    icon: 'GraduationCap',
    color: 'indigo',
    category: 'Education'
  },
  {
    id: 'property',
    name: 'Loan Against Property',
    slug: 'property-loan',
    description: 'Unlock the value of your property with loans against property. Get high loan amounts at competitive interest rates.',
    interestRate: {
      min: 10.5,
      max: 16.0,
      unit: '% p.a.'
    },
    loanAmount: {
      min: 500000,
      max: 10000000,
      currency: '₹'
    },
    tenure: {
      min: 5,
      max: 20,
      unit: 'years'
    },
    processingFee: '1% - 2% of loan amount',
    eligibility: [
      'Age: 21-65 years',
      'Property ownership proof',
      'CIBIL score: 650+',
      'Minimum income: ₹30,000/month',
      'Clear property title'
    ],
    features: [
      'High loan amounts',
      'Competitive interest rates',
      'Flexible repayment tenure',
      'Property valuation included',
      'Quick processing',
      'Balance transfer available'
    ],
    benefits: [
      'Higher loan-to-value ratio',
      'Lower interest rates',
      'Flexible end-use',
      'Tax benefits available',
      'Quick disbursement'
    ],
    documents: [
      'Property documents',
      'Identity proof',
      'Income proof',
      'Bank statements',
      'Property valuation report',
      'NOC from society'
    ],
    emiExample: {
      amount: 3000000,
      tenure: 15,
      rate: 13.0,
      emi: 35647
    },
    icon: 'Building',
    color: 'teal',
    category: 'Property'
  }
];

export const getLoanById = (id: string): LoanDetails | undefined => {
  return loanTypes.find(loan => loan.id === id);
};

export const getLoanBySlug = (slug: string): LoanDetails | undefined => {
  return loanTypes.find(loan => loan.slug === slug);
};