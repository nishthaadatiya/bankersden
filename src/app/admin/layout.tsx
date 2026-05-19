import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Admin Dashboard - Banker's Den",
  description: 'Admin panel for managing leads and applications',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}