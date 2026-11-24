import { useState, useEffect, useRef } from 'react'
import fallbackBg from '../../assets/hero.bg.jpg'
import { getMenuImage } from '../../utils/menuImages'
import { useOrderNow, money, orangeBtn } from './ui'

// One slide's title, subtitle and "Order now" button (same look as MenuBanner)
function SlideText({ item, active }) {
  const { size, orderNow } = useOrderNow(item)
  const label = item.badge === 'Trending' ? 'Trending now' : item.badge
  const subtitle = [label, item.note].filter(Boolean).join(' · ') || "A Tony's favourite"

  return (
    <div
      aria-hidden={!active}
      className={`absolute transition-opacity duration-1000 ${active ? '' : 'pointer-events-none'}`}
      style={{ opacity: active ? 1 : 0 }}
    >
      <h2
        className="text-4xl md:text-6xl font-bold italic text-white mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {item.name}
      </h2>
      <p className="text-lg md:text-xl text-neutral-200">{subtitle}</p>
      <button tabIndex={active ? 0 : -1} onClick={orderNow} className={`${orangeBtn} mt-6`}>
        Order now{size ? ` · ${money(size.price)}` : ''}
      </button>
    </div>
  )
}

// Same design as the menu page banner (MenuBanner), but each slide is a trending dish
function TrendingBanner({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)

  useEffect(() => {
    if (paused || items.length < 2) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [paused, items.length])

  const go = (i) => setActiveIndex((i + items.length) % items.length)

  return (
    <section
      className="relative h-[70vh] min-h-[420px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null || items.length < 2) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) > 50) go(activeIndex + (dx < 0 ? 1 : -1))
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${getMenuImage(item.name) || fallbackBg})`,
            filter: 'brightness(0.55)',
            opacity: i === activeIndex ? 1 : 0,
          }}
        />
      ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
        {items.map((item, i) => (
          <SlideText key={item.id} item={item} active={i === activeIndex} />
        ))}
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show ${item.name}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeIndex ? 'bg-orange-500' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default TrendingBanner