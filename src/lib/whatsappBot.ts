export interface BotResponse {
  replyText: string;
  step: string;
  enquiryData: any;
  isComplete: boolean;
  leadPayload?: any;
}

export interface SessionCacheItem {
  step: string;
  enquiryData: any;
  contactName: string;
  lastUserMessageAt: Date;
}

declare global {
  var whatsAppSessionCache: Map<string, SessionCacheItem> | undefined;
}

const sessionCache = global.whatsAppSessionCache || new Map<string, SessionCacheItem>();
if (!global.whatsAppSessionCache) {
  global.whatsAppSessionCache = sessionCache;
}

export function getSession(phoneNumber: string): SessionCacheItem | undefined {
  return sessionCache.get(phoneNumber);
}

export function setSession(phoneNumber: string, data: SessionCacheItem): void {
  sessionCache.set(phoneNumber, data);
}

export function clearSession(phoneNumber: string): void {
  sessionCache.delete(phoneNumber);
}

/**
 * Robust currency parser supporting Indian number conventions:
 * 50k, 50,000, 5 lakh, 2.5 lacs, 1 crore, 1.5cr, ₹50000
 */
export function parseAmount(text: string): number | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  // Negative / zero values
  if (/^(0|zero|nil|none|no|na|n\/a|nope|nothing|nah)$/i.test(clean)) {
    return 0;
  }

  // Disregard single-digit menu selections (e.g. "1" or "2") as currency amounts
  if (/^[1-9]$/.test(clean)) {
    return null;
  }

  // Crore / Cr: "1.5 cr", "2 crore", "1cr"
  const crMatch = clean.match(/([\d,.]+)\s*(?:cr|crore|crores)\b/i);
  if (crMatch) {
    const num = parseFloat(crMatch[1].replace(/,/g, ''));
    if (!isNaN(num)) return Math.round(num * 10000000);
  }

  // Lakh / Lac: "5 lakh", "2.5 lacs", "10l", "10 lac"
  const lakhMatch = clean.match(/([\d,.]+)\s*(?:lakh|lakhs|lac|lacs|l)\b/i);
  if (lakhMatch) {
    const num = parseFloat(lakhMatch[1].replace(/,/g, ''));
    if (!isNaN(num)) return Math.round(num * 100000);
  }

  // Thousand / K: "50k", "50 k", "25 thousand"
  const kMatch = clean.match(/([\d,.]+)\s*(?:k|thousand|thousands)\b/i);
  if (kMatch) {
    const num = parseFloat(kMatch[1].replace(/,/g, ''));
    if (!isNaN(num)) return Math.round(num * 1000);
  }

  // Plain numeric string: "₹50,000", "50000", "50 000", "yes, 25000"
  const numMatch = clean.match(/(?:rs\.?|inr|₹)?\s*(\d[\d,]*(?:\.\d+)?)/i);
  if (numMatch) {
    const num = parseFloat(numMatch[1].replace(/,/g, ''));
    if (!isNaN(num)) return Math.round(num);
  }

  return null;
}

export function detectEmploymentType(text: string): 'salaried' | 'business' | null {
  const t = text.toLowerCase().trim();
  // Check exact 1 or keywords for salaried
  if (/\b(1|salaried|salary|job|working|employee|service|private job|govt job)\b/i.test(t)) {
    return 'salaried';
  }
  // Check exact 2 or keywords for business / self-employed
  if (/\b(2|business|self[- ]employed|owner|shop|proprietor|entrepreneur|freelance|director|consultant)\b/i.test(t)) {
    return 'business';
  }
  return null;
}

export function isNegativeResponse(text: string): boolean {
  return /^(no|none|nil|0|zero|na|n\/a|nope|nothing|nah)$/i.test(text.trim());
}

export function isHumanHandover(text: string): boolean {
  return /\b(human|agent|representative|talk to person|customer care|manager|call me|speak to human|support)\b/i.test(text);
}

export function isRestartCommand(text: string): boolean {
  return /^(restart|reset|start over|menu|begin)$/i.test(text.trim());
}

/**
 * State machine enforcing the whatsapp.md flow.
 */
export function handleUserMessage(
  userText: string,
  existingStep: string = 'INIT',
  existingData: any = {},
  contactName: string = '',
  phoneNumber: string = ''
): BotResponse {
  const text = userText.trim();
  let step = existingStep || 'INIT';
  const data = {
    employment_type: existingData.employment_type || null,
    gross_monthly_salary: existingData.gross_monthly_salary ?? null,
    monthly_deductions: existingData.monthly_deductions ?? null,
    business_income: existingData.business_income ?? null,
    business_income_basis: existingData.business_income_basis || 'monthly',
    existing_emi: existingData.existing_emi ?? null,
    existing_emi_amount: existingData.existing_emi_amount ?? null,
    tax_amount: existingData.tax_amount ?? null,
    tax_period: existingData.tax_period || 'annual',
    requested_loan_amount: existingData.requested_loan_amount ?? null,
    qualification_status: existingData.qualification_status || 'pending',
    follow_up_required: existingData.follow_up_required ?? null,
    missing_fields: [] as string[],
  };

  // 1. Human routing
  if (isHumanHandover(text)) {
    return {
      replyText:
        "I've routed your request to our senior loan advisor. A member of our team will contact you directly on this WhatsApp number shortly. 📞\n\nFor urgent queries, call +91 98347 84681.",
      step,
      enquiryData: data,
      isComplete: false,
    };
  }

  // 2. Restart command or completed state restart
  if (isRestartCommand(text) || (step === 'COMPLETED' && /^(hi|hello|hey|start|loan)/i.test(text))) {
    step = 'INIT';
    data.employment_type = null;
    data.gross_monthly_salary = null;
    data.monthly_deductions = null;
    data.business_income = null;
    data.existing_emi = null;
    data.existing_emi_amount = null;
    data.tax_amount = null;
    data.requested_loan_amount = null;
    data.qualification_status = 'pending';
    data.follow_up_required = null;
  }

  // ── Step 1: Identify Employment Type ─────────────────────────────────────
  if (step === 'INIT' || !data.employment_type) {
    const empType = detectEmploymentType(text);

    if (empType) {
      data.employment_type = empType;

      // Check if user also provided income/salary in the same message (e.g. "Salaried 75k")
      const extractedAmount = parseAmount(text);
      const hasDirectIncome = extractedAmount !== null && extractedAmount >= 1000;

      if (empType === 'salaried') {
        if (hasDirectIncome) {
          data.gross_monthly_salary = extractedAmount;
          step = 'SALARIED_DEDUCTIONS';
          return {
            replyText: `Got it, Gross Salary: ₹${extractedAmount.toLocaleString('en-IN')}.\n\nWhat are your approximate monthly salary deductions, such as PF or other deductions? (If none, reply 'No' or '0')`,
            step,
            enquiryData: data,
            isComplete: false,
          };
        } else {
          step = 'SALARIED_SALARY';
          return {
            replyText: 'What is your gross monthly salary before deductions?',
            step,
            enquiryData: data,
            isComplete: false,
          };
        }
      } else {
        // Business owner / self-employed
        if (hasDirectIncome) {
          data.business_income = extractedAmount;
          step = 'BUSINESS_EMI';
          return {
            replyText: `Got it, Monthly Business Income: ₹${extractedAmount.toLocaleString('en-IN')}.\n\nDo you currently have any loan EMIs? If yes, what is the total monthly EMI amount? If not, please reply 'No'.`,
            step,
            enquiryData: data,
            isComplete: false,
          };
        } else {
          step = 'BUSINESS_INCOME';
          return {
            replyText: 'What is your approximate monthly business income?',
            step,
            enquiryData: data,
            isComplete: false,
          };
        }
      }
    }

    // Default Step 1 Question (greeting + options)
    const greeting = contactName ? `Hi ${contactName}! 👋` : 'Hi! 👋';
    return {
      replyText: `${greeting} To help you with your loan enquiry, could you please tell me whether you are:

1. Salaried
2. Business owner / Self-employed`,
      step: 'INIT',
      enquiryData: data,
      isComplete: false,
    };
  }

  // ── Step 2A: Salaried Flow ───────────────────────────────────────────────
  if (data.employment_type === 'salaried') {
    // 1. Gross monthly salary
    if (step === 'SALARIED_SALARY' || data.gross_monthly_salary === null) {
      const amount = parseAmount(text);
      if (amount !== null && amount > 0) {
        data.gross_monthly_salary = amount;
        step = 'SALARIED_DEDUCTIONS';
        return {
          replyText: 'What are your approximate monthly salary deductions, such as PF or other deductions? (If none, reply \'No\' or \'0\')',
          step,
          enquiryData: data,
          isComplete: false,
        };
      }
      return {
        replyText: 'Please enter your approximate gross monthly salary in rupees (for example: 50,000 or 50k):',
        step: 'SALARIED_SALARY',
        enquiryData: data,
        isComplete: false,
      };
    }

    // 2. Monthly deductions
    if (step === 'SALARIED_DEDUCTIONS' || data.monthly_deductions === null) {
      if (isNegativeResponse(text)) {
        data.monthly_deductions = 0;
      } else {
        const amount = parseAmount(text);
        if (amount !== null) {
          data.monthly_deductions = amount;
        } else {
          return {
            replyText: 'What are your approximate monthly deductions? If you don\'t have any, simply reply \'No\'.',
            step: 'SALARIED_DEDUCTIONS',
            enquiryData: data,
            isComplete: false,
          };
        }
      }

      step = 'SALARIED_EMI';
      return {
        replyText: 'Do you currently have any loan EMIs? If yes, what is the total monthly EMI amount? If not, please reply \'No\'.',
        step,
        enquiryData: data,
        isComplete: false,
      };
    }

    // 3. Existing EMIs
    if (step === 'SALARIED_EMI' || data.existing_emi === null) {
      if (isNegativeResponse(text)) {
        data.existing_emi = false;
        data.existing_emi_amount = 0;
      } else {
        const amount = parseAmount(text);
        if (amount !== null && amount > 0) {
          data.existing_emi = true;
          data.existing_emi_amount = amount;
        } else if (/^(yes|yep|yeah|have|present)\b/i.test(text)) {
          return {
            replyText: 'What is your total monthly EMI amount? (e.g., 15,000 or 15k)',
            step: 'SALARIED_EMI',
            enquiryData: data,
            isComplete: false,
          };
        } else {
          return {
            replyText: 'Please share your total monthly EMI amount, or reply \'No\' if you have no active loans.',
            step: 'SALARIED_EMI',
            enquiryData: data,
            isComplete: false,
          };
        }
      }

      step = 'SALARIED_LOAN_AMOUNT';
      return {
        replyText: 'How much loan amount are you looking for?',
        step,
        enquiryData: data,
        isComplete: false,
      };
    }

    // 4. Required Loan Amount
    if (step === 'SALARIED_LOAN_AMOUNT' || data.requested_loan_amount === null) {
      const amount = parseAmount(text);
      if (amount !== null && amount > 0) {
        data.requested_loan_amount = amount;
        step = 'COMPLETED';
        data.qualification_status = 'pending';
        data.follow_up_required = true;

        const leadPayload = createLeadPayload(data, contactName, phoneNumber);

        return {
          replyText: 'Thank you for sharing your details! Our team will review your enquiry and contact you regarding the next steps.',
          step,
          enquiryData: data,
          isComplete: true,
          leadPayload,
        };
      }

      return {
        replyText: 'Please tell us the required loan amount in rupees (for example: 5 Lakhs or 500,000):',
        step: 'SALARIED_LOAN_AMOUNT',
        enquiryData: data,
        isComplete: false,
      };
    }
  }

  // ── Step 2B: Business Owner / Self-Employed Flow ─────────────────────────
  if (data.employment_type === 'business') {
    // 1. Business income
    if (step === 'BUSINESS_INCOME' || data.business_income === null) {
      const amount = parseAmount(text);
      if (amount !== null && amount > 0) {
        data.business_income = amount;
        data.business_income_basis = 'monthly';
        step = 'BUSINESS_EMI';
        return {
          replyText: 'Do you currently have any loan EMIs? If yes, what is the total monthly EMI amount? If not, please reply \'No\'.',
          step,
          enquiryData: data,
          isComplete: false,
        };
      }
      return {
        replyText: 'What is your approximate monthly business income? (for example: 1 Lakh or 100,000)',
        step: 'BUSINESS_INCOME',
        enquiryData: data,
        isComplete: false,
      };
    }

    // 2. Existing EMIs
    if (step === 'BUSINESS_EMI' || data.existing_emi === null) {
      if (isNegativeResponse(text)) {
        data.existing_emi = false;
        data.existing_emi_amount = 0;
      } else {
        const amount = parseAmount(text);
        if (amount !== null && amount > 0) {
          data.existing_emi = true;
          data.existing_emi_amount = amount;
        } else if (/^(yes|yep|yeah|have)\b/i.test(text)) {
          return {
            replyText: 'What is your total monthly EMI amount? (e.g., 20,000 or 20k)',
            step: 'BUSINESS_EMI',
            enquiryData: data,
            isComplete: false,
          };
        } else {
          return {
            replyText: 'Please share your total monthly EMI amount, or reply \'No\' if you have no active loans.',
            step: 'BUSINESS_EMI',
            enquiryData: data,
            isComplete: false,
          };
        }
      }

      step = 'BUSINESS_TAX';
      return {
        replyText: 'What is your approximate tax amount or tax liability? (Reply \'No\' or \'0\' if not applicable)',
        step,
        enquiryData: data,
        isComplete: false,
      };
    }

    // 3. Taxes
    if (step === 'BUSINESS_TAX' || data.tax_amount === null) {
      if (isNegativeResponse(text)) {
        data.tax_amount = 0;
      } else {
        const amount = parseAmount(text);
        if (amount !== null) {
          data.tax_amount = amount;
        } else {
          return {
            replyText: 'What is your approximate annual/monthly tax liability? (Reply \'No\' if not applicable)',
            step: 'BUSINESS_TAX',
            enquiryData: data,
            isComplete: false,
          };
        }
      }

      step = 'BUSINESS_LOAN_AMOUNT';
      return {
        replyText: 'How much loan amount are you looking for?',
        step,
        enquiryData: data,
        isComplete: false,
      };
    }

    // 4. Required Loan Amount
    if (step === 'BUSINESS_LOAN_AMOUNT' || data.requested_loan_amount === null) {
      const amount = parseAmount(text);
      if (amount !== null && amount > 0) {
        data.requested_loan_amount = amount;
        step = 'COMPLETED';
        data.qualification_status = 'pending';
        data.follow_up_required = true;

        const leadPayload = createLeadPayload(data, contactName, phoneNumber);

        return {
          replyText: 'Thank you for sharing your details! Our team will review your enquiry and contact you regarding the next steps.',
          step,
          enquiryData: data,
          isComplete: true,
          leadPayload,
        };
      }

      return {
        replyText: 'Please specify the required loan amount in rupees (for example: 10 Lakhs or 1 Crore):',
        step: 'BUSINESS_LOAN_AMOUNT',
        enquiryData: data,
        isComplete: false,
      };
    }
  }

  // Fallback if completed or unhandled
  return {
    replyText: 'Thank you! We have already received your loan enquiry details. Our advisor will reach out shortly.\n\nReply \'Restart\' anytime to start a new enquiry.',
    step: 'COMPLETED',
    enquiryData: data,
    isComplete: true,
  };
}

function createLeadPayload(data: any, contactName: string, phoneNumber: string) {
  const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
  const income =
    data.employment_type === 'salaried'
      ? data.gross_monthly_salary
      : data.business_income;

  const details = [
    `Employment Type: ${data.employment_type}`,
    data.gross_monthly_salary ? `Gross Salary: ₹${data.gross_monthly_salary.toLocaleString('en-IN')}` : null,
    data.monthly_deductions !== null ? `Deductions: ₹${data.monthly_deductions.toLocaleString('en-IN')}` : null,
    data.business_income ? `Business Income: ₹${data.business_income.toLocaleString('en-IN')}` : null,
    data.existing_emi_amount ? `Existing EMI: ₹${data.existing_emi_amount.toLocaleString('en-IN')}` : 'Existing EMI: Nil',
    data.tax_amount !== null ? `Tax: ₹${data.tax_amount.toLocaleString('en-IN')}` : null,
    data.requested_loan_amount ? `Requested Loan: ₹${data.requested_loan_amount.toLocaleString('en-IN')}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    applicationNumber: `WA-${Date.now()}`,
    type: 'contact',
    status: 'active',
    full_name: contactName || 'WhatsApp Applicant',
    phone: cleanPhone.length === 10 ? cleanPhone : '9999999999',
    email: `whatsapp_${cleanPhone || Date.now()}@bankersdens.com`,
    loanAmount: data.requested_loan_amount || undefined,
    monthlyIncome: income || undefined,
    category: `${data.employment_type === 'salaried' ? 'Salaried' : 'Business'} Loan Enquiry (WhatsApp)`,
    message: `[Captured via WhatsApp Bot Flow]\n\n${details}`,
  };
}
