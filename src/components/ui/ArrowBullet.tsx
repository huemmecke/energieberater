import arrowLight from '../../../assets/ewe_arrow_light.svg'
import arrowRegular from '../../../assets/ewe_arrow_regular.svg'

type ArrowBulletProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'heading'
}

const sizes = {
  sm: { regular: 'h-3.5', light: 'h-4' },
  md: { regular: 'h-4', light: 'h-5' },
  lg: { regular: 'h-5', light: 'h-6' },
  heading: { regular: 'h-7', light: 'h-7 sm:h-8 lg:h-10' },
}

export function ArrowBullet({ className = '', size = 'md' }: ArrowBulletProps) {
  const s = sizes[size]
  return (
    <span className={`inline-flex shrink-0 items-center ${className}`} aria-hidden="true">
      <img src={arrowRegular} alt="" className={`${s.regular} w-auto sm:hidden`} />
      <img src={arrowLight} alt="" className={`hidden ${s.light} w-auto sm:block`} />
    </span>
  )
}
