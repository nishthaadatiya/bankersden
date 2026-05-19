import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientLayout } from '@/components/ClientLayout'
import { Providers } from '@/components/Providers'
import Chatbot from '@/components/Chatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: "Banker's Den - India's #1 Digital Lending Platform | Quick Loan Approvals",
    template: "%s | Banker's Den"
  },
  description: "Get instant loan approvals with competitive interest rates. Personal loans, home loans, business loans, car loans & more. ₹585+ Crores disbursed to 700+ happy customers.",
  keywords: [
    'personal loan',
    'home loan', 
    'business loan',
    'car loan',
    'education loan',
    'loan against property',
    'instant loan approval',
    'lowest interest rates',
    'digital lending',
    'online loan application',
    'EMI calculator',
    'loan eligibility',
    'quick loan disbursal',
    'collateral free loans',
    'India loan platform'
  ],
  authors: [{ name: "Banker's Den" }],
  creator: "Banker's Den",
  publisher: "Banker's Den",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://bankersdens.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXTAUTH_URL || 'https://bankersdens.com',
    title: "Banker's Den - India's #1 Digital Lending Platform",
    description: "Get instant loan approvals with India's lowest interest rates. ₹585+ Crores disbursed to 700+ happy customers across India.",
    siteName: "Banker's Den",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Banker's Den - Digital Lending Platform",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Banker's Den - India's #1 Digital Lending Platform",
    description: "Get instant loan approvals with India's lowest interest rates. ₹585+ Crores disbursed to 700+ happy customers.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logobg.png" type="image/png" />
        <link rel="shortcut icon" href="/logobg.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logobg.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
          <Chatbot />
        </Providers>
      </body>
    </html>
  )
}