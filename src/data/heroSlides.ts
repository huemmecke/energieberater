import imgHouses from '../../assets/img/dr-ina-melny-p-ArjNg6NG8-unsplash.jpg'
import imgCabin from '../../assets/img/hero-slide-forest-cabin.jpg'
import imgWater from '../../assets/img/hero-slide-water-houses.jpg'

export type SlideAlign = 'center' | 'bottom-center' | 'bottom-right' | 'top-right'

export type HeroSlide = {
  image: string
  text: string
  align: SlideAlign
}

export const heroSlides: HeroSlide[] = [
  {
    image: imgHouses,
    text: 'Wie können wir unser Schätzchen fit machen für die Zukunft?',
    align: 'bottom-center',
  },
  {
    image: imgCabin,
    text: 'Wie können wir in Harmonie mit Umwelt und Natur leben?',
    align: 'bottom-center',
  },
  {
    image: imgWater,
    text: 'Wie können wir eine nachhaltige Energieversorgung nutzen?',
    align: 'center',
  },
]
