import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import margherita from '../assets/margherita.png'
import diavola from '../assets/bufalina.png'
import pepperoni from '../assets/napoletana.png'
import { ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'

const pizzas = [
  { name: 'Margherita', matchName: 'Margherita', price: '$12.99', image: margherita, description: "The original. San Marzano tomatoes, fresh mozzarella, and basil — simple, timeless, unforgettable." },
  { name: 'Bufalina', matchName: 'Bufalina', price: '$14.99', image: diavola, description: "Rich buffalo mozzarella and slow-cooked tomato sauce, finished with a drizzle of olive oil." },
  { name: 'Napoletana', matchName: 'Napoletana', price: '$13.99', image: pepperoni, description: "Anchovies, capers, and oregano over a classic Neapolitan base — bold, salty, and full of character." },
]

function PopularPizzas({ menuData = [] }) {
  const { addItem } = useCart()
  const [addedIndex, setAddedIndex] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const containerRef = useRef(null)
  const [rawProgress, setRawProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateProgress = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrolled = -rect.top
      const p = Math.min(Math.max(scrolled / window.innerHeight, 0), pizzas.length - 1)
      setRawProgress(p)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAddToCart = (pizza, i) => {
    const matched = menuData.find(
      (m) => m.name.toLowerCase() === pizza.matchName.toLowerCase()
    )
    if (!matched || !matched.sizes || matched.sizes.length === 0) {
      console.warn(`Could not find "${pizza.matchName}" in menuData`, menuData)
      return
    }

    const size = matched.sizes[0]
    addItem({
      menuItemId: matched.id,
      name: pizza.name,
      image: pizza.image,
      sizeId: size.id,
      sizeLabel: size.size,
      toppingIds: [],
      toppingsLabel: '',
      unitPrice: parseFloat(size.price),
    })
    setAddedIndex(i)
    setShowToast(true)
    setTimeout(() => setAddedIndex(null), 1200)
    setTimeout(() => setShowToast(false), 4000)
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${pizzas.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {pizzas.map((pizza, i) => {
          const localProgress = Math.min(Math.max(rawProgress - (i - 1), 0), 1)
          const exitProgress = Math.min(Math.max(rawProgress - i, 0), 1)

          return (
            <div
              key={pizza.name}
              className="absolute inset-0"
              style={{
                zIndex: i,
                transform:
                  i === 0
                    ? 'none'
                    : `translate3d(0, ${(1 - localProgress) * 100}%, 0)`,
                willChange: 'transform',
                transition: 'transform 80ms linear',
              }}
            >
              <section className="relative h-full w-full flex items-center overflow-hidden px-8 md:px-16">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${pizza.image})`,
                    filter: 'brightness(0.6)',
                    transform: `translate3d(0, ${-exitProgress * 60}px, 0) scale(${1 + exitProgress * 0.06})`,
                    willChange: 'transform',
                    transition: 'transform 80ms linear',
                  }}
                />
                <div className="hidden md:flex flex-col items-center gap-2 absolute right-8 bottom-10 z-10 text-white/50">
                  <span className="text-[10px] tracking-[0.2em] font-medium [writing-mode:vertical-rl]">
                    SCROLL
                  </span>
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </div>

                <div
                  className="relative z-10 max-w-2xl"
                  style={{
                    transform: `translate3d(0, ${-exitProgress * 100}px, 0)`,
                    opacity: 1 - exitProgress,
                    willChange: 'transform, opacity',
                    transition: 'transform 80ms linear, opacity 80ms linear',
                  }}
                >
                  <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase text-white leading-none">
                    {pizza.name}
                  </h2>

                  <p
                    className="text-lg md:text-xl text-neutral-200 mt-4 max-w-md italic"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {pizza.description}
                  </p>

                  <div className="flex items-center gap-5 mt-6">
                    <span className="text-white text-3xl md:text-4xl font-bold">{pizza.price}</span>
                    <button
                      onClick={() => handleAddToCart(pizza, i)}
                      className={`px-8 py-3.5 rounded-full font-semibold text-lg transition-colors ${
                        addedIndex === i
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      {addedIndex === i ? 'Added ✓' : 'Add to Cart'}
                    </button>
                  </div>
                </div>

                <span className="absolute z-10 top-8 right-8 text-white/40 text-sm font-medium">
                  {String(i + 1).padStart(2, '0')} / {String(pizzas.length).padStart(2, '0')}
                </span>
              </section>
            </div>
          )
        })}
      </div>

      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-6 py-3.5 rounded-full shadow-xl flex items-center gap-4">
          <span className="text-sm font-medium">Added to cart!</span>
          <Link
            to="/cart"
            className="bg-orange-500 hover:bg-orange-600 transition-colors text-sm font-semibold px-4 py-1.5 rounded-full"
          >
            Go to Cart
          </Link>
        </div>
      )}
    </section>
  )
}

export default PopularPizzas