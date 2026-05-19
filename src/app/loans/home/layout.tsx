import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Home Loan - Lowest Interest Rates Starting 8.25% | Banker's Den",
  description: "Get home loans with India's lowest interest rates starting from 8.25% p.a. Up to ₹5 crores with flexible tenure. Quick approval & doorstep service.",
  keywords: [
    'home loan',
    'home loan interest rates',
    'home loan calculator',
    'home loan eligibility',
    'lowest home loan rates',
    'home loan apply online',
    'home loan EMI calculator',
    'property loan India'
  ],
  openGraph: {
    title: "Home Loan - Lowest Interest Rates Starting 8.25%",
    description: "Get home loans with India's lowest interest rates. Up to ₹5 crores with flexible tenure and quick approval.",
    url: 'https://bankersden.com/loans/home',
  },
}

export default function HomeLoanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}