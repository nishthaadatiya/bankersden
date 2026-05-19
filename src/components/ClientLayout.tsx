'use client';

import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? 'min-h-screen' : 'flex-grow'}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}