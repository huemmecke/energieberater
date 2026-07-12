import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  accent?: 'navy' | 'green' | 'red' | 'amber' | 'blue'
}

const accents = {
  navy: 'border-l-ewe-navy',
  green: 'border-l-emerald-600',
  red: 'border-l-red-500',
  amber: 'border-l-amber-500',
  blue: 'border-l-blue-500',
}

export function Card({ children, className = '', accent }: CardProps) {
  return (
    <div
      className={`rounded border border-ewe-navy/10 bg-white p-6 shadow-sm ${accent ? `border-l-4 ${accents[accent]}` : ''} ${className}`}
    >
      {children}
    </div>
  )
}
