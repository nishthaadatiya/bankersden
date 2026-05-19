import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Loan Calculators - EMI, Eligibility & Part Payment | Banker's Den",
  description: "Calculate your loan EMI, check eligibility, and plan part payments with our free online calculators. Home loan, personal loan, car loan calculators.",
  keywords: [
    'EMI calculator',
    'loan calculator',
    'home loan calculator',
    'personal loan calculator',
    'loan eligibility calculator',
    'part payment calculator',
    'interest calculator',
    'loan planning tools'
  ],
  openGraph: {
    title: "Loan Calculators - EMI, Eligibility & Part Payment",
    description: "Free online loan calculators to help you plan your finances. Calculate EMI, check eligibility, and optimize your loan payments.",
    url: 'https://bankersden.com/calculators',
  },
}

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}