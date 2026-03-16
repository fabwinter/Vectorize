import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vectorizer - AI-Powered Image to SVG Converter',
  description: 'Convert your images to clean, scalable vector graphics with AI-powered vectorization',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        {children}
      </body>
    </html>
  )
}
