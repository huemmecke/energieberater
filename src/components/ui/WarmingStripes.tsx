import warmingStripes from '../../../assets/20190725_COMPARE_Warming_stripes_-_N_vs_S_northern_1880-2018_(ref_1901-2000).jpg'

type WarmingStripesProps = {
  className?: string
}

export function WarmingStripes({ className = '' }: WarmingStripesProps) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      title="Warming Stripes – globale Temperaturanomalie 1880–2018 (Prof. Ed Hawkins)"
      role="img"
      aria-label="Klimastreifen: Blau = kühlere Jahre, Rot = wärmere Jahre"
    >
      <img
        src={warmingStripes}
        alt=""
        aria-hidden="true"
        className="block h-3 w-full object-cover object-center sm:h-3.5"
      />
    </div>
  )
}
