import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Allo — Learn Quebec French',
  description: 'Scenario-based Quebec French ↔ English language learning. Built for people in Quebec who need to communicate confidently in real-life situations.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Allo',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    title: 'Allo — Learn Quebec French',
    description: 'Learn exactly the French you need for your real-life situation. Daycare pickup, doctor visits, workplace, and more.',
    siteName: 'Allo',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#DCEEFB',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={roboto.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
