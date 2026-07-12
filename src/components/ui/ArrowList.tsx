import type { ReactNode } from 'react'
import { ArrowBullet } from './ArrowBullet'

type ArrowListProps = {
  items: ReactNode[]
  className?: string
  itemClassName?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ArrowList({
  items,
  className = '',
  itemClassName = '',
  size = 'md',
}: ArrowListProps) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className={`flex items-start gap-2.5 ${itemClassName}`}>
          <ArrowBullet size={size} className="mt-0.5" />
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  )
}
