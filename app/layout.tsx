import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import ThemeToggle from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trevia Consultancy — Book a Consultation',
  description: 'Schedule your Financial Planning consultation with Trevia Consultancy',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logos/logo-silver.png"
                alt="Trevia Consultancy"
                className="h-10 dark:hidden"
              />
              <img
                src="/logos/logo-gold.png"
                alt="Trevia Consultancy"
                className="h-10 hidden dark:block"
              />
              <img
                src="/logos/logo-name-silver.png"
                alt="Trevia Consultancy"
                className="h-8 dark:hidden"
              />
              <img
                src="/logos/logo-name-gold.png"
                alt="Trevia Consultancy"
                className="h-8 hidden dark:block"
              />
            </div>
            <ThemeToggle />
          </header>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
