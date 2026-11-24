import { useState, useEffect } from 'react'
import margherita from '../assets/margherita.png'
import diavola from '../assets/bufalina.png'
import pepperoni from '../assets/napoletana.png'

const slides = [
  {
    image: margherita,
    title: 'Crafted Fresh, Every Time',
    subtitle: 'Real dough, real cheese, no shortcuts.',
  },
  {
    image: diavola,
    title: 'Bold Flavors, Classic Roots',
    subtitle: 'Recipes rooted in Naples, made for today.',
  },
  {
    image: pepperoni,
    title: 'Wood-Fired, Always Hot',
    subtitle: 'Straight from the oven to your table.',
  },
]

function MenuBanner() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${slide.image})`,
            filter: 'brightness(0.55)',
            opacity: i === activeIndex ? 1 : 0,
          }}
        />
      ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute transition-opacity duration-1000"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
          >
            <h2
              className="text-4xl md:text-6xl font-bold italic text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {slide.title}
            </h2>
            <p className="text-lg md:text-xl text-neutral-200">
              {slide.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === activeIndex ? 'bg-orange-500' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default MenuBanner