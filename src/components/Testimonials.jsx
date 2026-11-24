import { useRef, useState, useEffect } from 'react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah M.',
    quote:
      "Ordered by phone and the AI assistant got everything right on the first try. Pizza showed up hot and fresh — honestly better than most places I've called a human for.",
    rating: 5,
  },
  {
    name: 'James O.',
    quote:
      'The Bufalina is unreal. You can tell the ingredients are actually fresh, not the usual frozen stuff. Become our go-to Friday night order.',
    rating: 5,
  },
  {
    name: 'Aisha K.',
    quote:
      "Fast delivery, hot pizza, zero hassle ordering. What more do you want from a pizza place? We're hooked.",
    rating: 5,
  },
]

function TestimonialCard({ t, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="flex flex-col border-t border-neutral-700 pt-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
      }}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
        ))}
      </div>

      <p
        className="text-neutral-200 text-lg leading-relaxed italic mb-6"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        "{t.quote}"
      </p>

      <span className="text-white font-semibold mt-auto">— {t.name}</span>
    </div>
  )
}

function Testimonials() {
  return (
    <section className="bg-neutral-900 py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl md:text-5xl text-center text-white mb-4"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          What People Are Saying
        </h2>
        <p className="text-center text-neutral-400 mb-16">
          Real stories from our customers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials