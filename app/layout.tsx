import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'DBS Notes — Database Systems Blog',
  description: 'A collaborative academic blog for Database Systems students to document and share unit notes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-parchment antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
