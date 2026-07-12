import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
