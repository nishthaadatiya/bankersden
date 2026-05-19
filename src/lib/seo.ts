import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noIndex?: boolean
}

export function generateSEO({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = '/og-image.jpg',
  noIndex = false
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://bankersdens.com'
  const fullTitle = title.includes("Banker's Den") ? title : `${title} | Banker's Den`
  
  return {
    title: fullTitle,
    description,
    keywords: [...keywords, "Banker's Den", "loan", "India", "financial services"],
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : undefined,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      siteName: "Banker's Den",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// Predefined SEO configs for common pages
export const seoConfigs = {
  home: {
    title: "India's #1 Digital Lending Platform | Quick Loan Approvals",
    description: "Get instant loan approvals with India's lowest interest rates. Personal loans, home loans, business loans & more. ₹585+ Crores disbursed to 700+ customers.",
    keywords: ['instant loan approval', 'lowest interest rates India', 'digital lending platform'],
    canonical: '/'
  },
  
  homeLoan: {
    title: "Home Loan - Lowest Interest Rates Starting 8.25%",
    description: "Get home loans with India's lowest interest rates starting from 8.25% p.a. Up to ₹5 crores with flexible tenure. Quick approval & doorstep service.",
    keywords: ['home loan', 'home loan interest rates', 'home loan calculator', 'lowest home loan rates'],
    canonical: '/loans/home'
  },
  
  personalLoan: {
    title: "Personal Loan - Quick Approval Up to ₹50 Lakhs",
    description: "Get personal loans up to ₹50 lakhs with competitive rates starting from 8.5% p.a. Instant approval, minimal documentation, 100% digital process.",
    keywords: ['personal loan', 'instant personal loan', 'personal loan online', 'quick personal loan'],
    canonical: '/loans/personal'
  },
  
  calculators: {
    title: "Loan Calculators - EMI, Eligibility & Part Payment",
    description: "Calculate your loan EMI, check eligibility, and plan part payments with our free online calculators. Home loan, personal loan, car loan calculators.",
    keywords: ['EMI calculator', 'loan calculator', 'loan eligibility calculator', 'part payment calculator'],
    canonical: '/calculators'
  }
}