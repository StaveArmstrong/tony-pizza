import { useRef, useState, useEffect } from 'react'
import heroBg from '../assets/pizza-bg.png'
import pizzaFloat from '../assets/pizza.png'
import { Wheat } from 'lucide-react'
import { Link } from 'react-router-dom'
import PopularPizzas from '../components/PopularPizzas'
import WhyChooseUs from '../components/WhyChooseUs'
import Testimonials from '../components/Testimonials'
import CtaBannerPhoto from '../components/CtaBannerPhoto'

function Home() {
  const heroRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [menuData, setMenuData] = useState([])

  useEffect(() => {
    let ticking = false

    const updateProgress = () => {
      if (!heroRef.current) return
      const scrollableDistance = heroRef.current.offsetHeight - window.innerHeight
      const scrolled = -heroRef.current.getBoundingClientRect().top
      const p = Math.min(Math.max(scrolled / scrollableDistance, 0), 1)
      setProgress(p)
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

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => setMenuData(data))
      .catch(() => setMenuData([]))
  }, [])

  return (
    <>
      <section ref={heroRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroBg})`,
              transform: `translateY(${-progress * 80}px) scale(${1 + progress * 0.08})`,
              willChange: 'transform',
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <img
              src={pizzaFloat}
              alt="Fresh pizza"
              className="hidden md:block absolute -right-8 lg:right-0 top-1/2 -translate-y-1/2 w-[42rem] lg:w-[52rem] drop-shadow-2xl"
            />

            <div
              className="absolute top-0 left-0 w-full h-full flex items-center px-8 md:px-16"
              style={{
                transform: `translateY(${-progress * 120}px)`,
                opacity: 1 - progress,
                willChange: 'transform, opacity',
              }}
            >
              <div className="w-full md:w-1/2">
                <h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold italic text-white mb-6 leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Your perfect pizza, made your way.
                </h1>
                <p className="text-lg md:text-xl text-neutral-200 mb-8 max-w-lg">
                  Fresh, hand-tossed pizza made to order. Choose your size, pick your toppings, and enjoy every bite while it's hot.
                </p>
                <Link
                  to="/menu"
                  className="inline-block bg-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 w-full h-[65vh] z-10 bg-[#f4ede1] flex items-center px-8"
            style={{ transform: `translateY(${(1 - progress) * 100}%)`, willChange: 'transform' }}
          >
            <div
              className="absolute top-0 left-0 w-full h-6 bg-[#f4ede1]"
              style={{
                maskImage: 'radial-gradient(circle at 12px 0, transparent 12px, black 13px)',
                maskRepeat: 'repeat-x',
                maskSize: '24px 24px',
                WebkitMaskImage: 'radial-gradient(circle at 12px 0, transparent 12px, black 13px)',
                WebkitMaskRepeat: 'repeat-x',
                WebkitMaskSize: '24px 24px',
                transform: 'translateY(-100%)',
              }}
            />

            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Wheat className="w-6 h-6 text-orange-500 hidden sm:block" />
                <h2
                  className="text-4xl md:text-5xl text-neutral-800"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  Tony Pizza
                </h2>
                <Wheat className="w-6 h-6 text-orange-500 hidden sm:block scale-x-[-1]" />
              </div>

              <p className="text-neutral-600 mb-3 leading-relaxed text-sm md:text-base">
                We're a family-run pizzeria serving hand-tossed, wood-fired pizza made
                fresh to order. Every pie starts with real dough, real cheese, and
                toppings we'd want on our own table.
              </p>
              <p className="text-neutral-600 mb-6 leading-relaxed text-sm md:text-base">
                From our kitchen to your door — order online or call in, and we'll
                have it hot and ready.
              </p>

              <button className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition-colors">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      <PopularPizzas menuData={menuData} />
      <WhyChooseUs />
      <Testimonials />
      <CtaBannerPhoto />
    </>
  )
}

export default Home