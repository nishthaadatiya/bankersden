/**
 * leadExtractor.ts
 * Extracts PII and intent signals from chatbot conversation messages.
 * Used to auto-generate leads without missing any potential customer.
 */

export interface ExtractedLeadData {
  name?: string;
  phone?: string;
  email?: string;
  loanType?: string;
  loanAmount?: string;
  income?: string;
  cibil?: string;
  intentSignals: string[];
  hasHighIntent: boolean;
}

// ─── Regex patterns ──────────────────────────────────────────────────────────

const PHONE_RE = /(?:\+91[-.\s]?|0)?[6-9]\d{9}/g;
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// Indian names — simple heuristic: 2–4 words, each capitalised (AI extracts in prompt)
// We'll parse the AI's own text for "name" mentions after the user gives it.
const NAME_CONTEXT_RE =
  /(?:(?:my name is|i am|i'm|call me|this is)\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})/gi;

const LOAN_TYPES: Record<string, string> = {
  personal: 'personal',
  home: 'home',
  house: 'home',
  property: 'home',
  business: 'business',
  car: 'car',
  vehicle: 'car',
  auto: 'car',
  education: 'education',
  student: 'education',
};

const AMOUNT_RE =
  /(?:rs\.?|inr|₹)?\s*(\d[\d,]*(?:\.\d+)?)\s*(?:lakh|lac|l|crore|cr|k|thousand)?/gi;

const INCOME_CONTEXT_RE =
  /(?:(?:my\s+)?(?:monthly\s+)?income\s+(?:is|=|:)?\s*)(?:rs\.?|inr|₹)?\s*(\d[\d,]*(?:\.\d+)?)/gi;

const CIBIL_RE = /\b([3-9]\d{2})\b/g; // 300-999

// ─── Intent keywords ─────────────────────────────────────────────────────────

const HIGH_INTENT_KEYWORDS = [
  'apply',
  'apply now',
  'i want a loan',
  'need a loan',
  'want loan',
  'interested',
  'how do i get',
  'can i get',
  'eligibility',
  'eligible',
  'approve',
  'approval',
  'proceed',
  'let\'s do it',
  'yes please',
  'go ahead',
  'check my eligibility',
  'talk to banker',
  'contact me',
  'call me',
  'reach me',
  'whatsapp',
  'callback',
];

const MEDIUM_INTENT_KEYWORDS = [
  'interest rate',
  'emi',
  'how much',
  'how long',
  'documents',
  'processing time',
  'processing fee',
  'what is the rate',
  'personal loan',
  'home loan',
  'business loan',
  'car loan',
  'compare',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripCommas(s: string) {
  return s.replace(/,/g, '');
}

function parseLoanAmount(text: string): string | undefined {
  // Look for amounts in context of loan
  const loanCtx =
    /(?:loan\s+(?:of|amount|for|:)?\s*)(?:rs\.?|inr|₹)?\s*(\d[\d,.]*(?:\.\d+)?)\s*(lakh|lac|l|crore|cr|k|thousand)?/gi;
  let m = loanCtx.exec(text);
  if (m) {
    const num = parseFloat(stripCommas(m[1]));
    const unit = (m[2] || '').toLowerCase();
    if (unit === 'lakh' || unit === 'lac' || unit === 'l')
      return `${num} Lakh`;
    if (unit === 'crore' || unit === 'cr') return `${num} Crore`;
    if (unit === 'k' || unit === 'thousand') return `${num * 1000}`;
    return `${num}`;
  }
  return undefined;
}

function detectLoanType(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [kw, type] of Object.entries(LOAN_TYPES)) {
    if (lower.includes(kw)) return type;
  }
  return undefined;
}

// ─── Main extractor ───────────────────────────────────────────────────────────

export function extractLeadData(
  messages: Array<{ role: string; text: string }>
): ExtractedLeadData {
  const allText = messages.map((m) => m.text).join('\n');
  const userText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.text)
    .join('\n');
  const modelText = messages
    .filter((m) => m.role === 'model')
    .map((m) => m.text)
    .join('\n');

  const result: ExtractedLeadData = {
    intentSignals: [],
    hasHighIntent: false,
  };

  // Context-aware extraction by iterating through messages
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    
    // If user message, check previous model message for context
    if (msg.role === 'user' && i > 0) {
      const prevMsg = messages[i - 1].text.toLowerCase();
      const userTxt = msg.text.trim();
      
      // Is it a raw number?
      const isNumber = /^\d+$/.test(userTxt.replace(/[,.]/g, ''));
      
      if (isNumber) {
        if (prevMsg.includes('income')) {
          result.income = userTxt;
        } else if (prevMsg.includes('amount')) {
          result.loanAmount = userTxt;
        } else if (prevMsg.includes('cibil') || prevMsg.includes('score')) {
          result.cibil = userTxt;
        }
      }
      
      // Look for a raw name (1-2 words) after asking for name
      if (prevMsg.includes('your name') && userTxt.split(/\s+/).length <= 2) {
        if (!result.name) {
          // Capitalize first letter of each word
          result.name = userTxt.replace(/\b\w/g, l => l.toUpperCase());
        }
      }
    }
  }

  // ── Phone ──
  const phones = userText.match(PHONE_RE);
  if (phones) {
    result.phone = phones[0].replace(/[-.\s]/g, '').replace(/^\+91/, '');
  }

  // ── Email ──
  const emails = userText.match(EMAIL_RE);
  if (emails) result.email = emails[0];

  // ── Name fallback (from bot references like "Thanks, Nishtha!") ──
  if (!result.name) {
    const modelNameMatch = modelText.match(/(?:Thanks|Thank you)[,!\s]+([A-Z][a-z]+)/);
    if (modelNameMatch) {
      result.name = modelNameMatch[1];
    }
  }
  
  // ── Name original fallback ──
  if (!result.name) {
    const nameMatches = Array.from(userText.matchAll(NAME_CONTEXT_RE));
    if (nameMatches.length > 0) {
      result.name = nameMatches[0][1].trim();
    }
  }

  // ── Loan type ──
  result.loanType = detectLoanType(userText) ?? detectLoanType(allText);

  // ── Loan amount fallback ──
  if (!result.loanAmount) {
    result.loanAmount = parseLoanAmount(userText) ?? parseLoanAmount(allText);
  }

  // ── Income fallback ──
  if (!result.income) {
    const incomeMatch = Array.from(userText.matchAll(INCOME_CONTEXT_RE));
    if (incomeMatch.length > 0) {
      result.income = stripCommas(incomeMatch[0][1]);
    }
  }

  // ── CIBIL fallback ──
  if (!result.cibil) {
    const cibilMatches = userText.match(CIBIL_RE);
    if (cibilMatches) {
      const candidate = cibilMatches.find((s) => {
        const n = parseInt(s);
        return n >= 300 && n <= 900;
      });
      if (candidate) result.cibil = candidate;
    }
  }

  // ── Intent signals ──
  const lower = userText.toLowerCase();
  for (const kw of HIGH_INTENT_KEYWORDS) {
    if (lower.includes(kw)) {
      result.intentSignals.push(kw);
      result.hasHighIntent = true;
    }
  }
  for (const kw of MEDIUM_INTENT_KEYWORDS) {
    if (lower.includes(kw) && !result.intentSignals.includes(kw)) {
      result.intentSignals.push(kw);
    }
  }

  // If phone number is shared → always high intent (they want contact)
  if (result.phone) result.hasHighIntent = true;

  return result;
}

/**
 * Decide whether we should create/update a lead from this session.
 * Criteria (any one is enough):
 *  - Phone number shared
 *  - Email shared + high intent keyword
 *  - 2+ high-intent keywords
 *  - Conversation has 6+ messages (invested user)
 */
export function shouldGenerateLead(
  extracted: ExtractedLeadData,
  messageCount: number
): boolean {
  if (extracted.phone) return true;
  if (extracted.email && extracted.hasHighIntent) return true;
  if (
    extracted.intentSignals.filter((s) =>
      HIGH_INTENT_KEYWORDS.includes(s)
    ).length >= 2
  )
    return true;
  if (messageCount >= 6 && extracted.hasHighIntent) return true;
  return false;
}
