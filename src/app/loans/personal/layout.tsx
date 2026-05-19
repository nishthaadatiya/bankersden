import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Personal Loan - Quick Approval Up to ₹50 Lakhs | Banker's Den",
  description: "Get personal loans up to ₹50 lakhs with competitive rates starting from 8.5% p.a. Instant approval, minimal documentation, 100% digital process.",
  keywords: [
    'personal loan',
    'instant personal loan',
    'personal loan online',
    'quick personal loan',
    'personal loan calculator',
    'personal loan eligibility',
    'unsecured loan',
    'digital loan approval'
  ],
  openGraph: {
    title: "Personal Loan - Quick Approval Up to ₹50 Lakhs",
    description: "Get personal loans with instant approval and competitive rates. Up to ₹50 lakhs with minimal documentation.",
    url: 'https://bankersden.com/loans/personal',
  },
}

export default function PersonalLoanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}