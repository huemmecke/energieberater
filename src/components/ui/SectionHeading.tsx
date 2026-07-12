import { ArrowBullet } from './ArrowBullet'

type SectionHeadingProps = {
  title: string
  subtitle?: string
  withIcon?: boolean
  align?: 'left' | 'center'
  light?: boolean
}

export function SectionHeading({
  title,
  subtitle,
  withIcon = false,
  align = 'center',
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'
  const titleColor = light ? 'text-white' : 'text-ewe-navy'
  const subtitleColor = light ? 'text-white/80' : 'text-ewe-muted'

  return (
    <div className={`mb-10 ${alignClass}`}>
      <div
        className={`flex items-center gap-3 sm:gap-4 ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        {withIcon && (
          <ArrowBullet
            size="heading"
            className={light ? 'brightness-0 invert' : ''}
          />
        )}
        <h2 className={`text-2xl font-light sm:text-3xl lg:text-4xl ${titleColor}`}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p
          className={`mx-auto mt-4 max-w-2xl text-base font-normal leading-relaxed ${subtitleColor} ${
            align === 'center' ? '' : 'mx-0'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
