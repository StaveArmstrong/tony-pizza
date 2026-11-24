import { useState } from 'react'
import { X } from 'lucide-react'
import voaImg from '../assets/VOA.png'
import homemadeImg from '../assets/home-made-pizza.jpg'
import deliveryImg from '../assets/fast delivery.jpg'
import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Order by Voice',
    description:
      "Call in and our AI assistant takes your order naturally — no hold music, no mix-ups, just tell it what you want.",
    image: voaImg,
  },
  {
    title: 'Fresh, Made to Order',
    description:
      'Real dough, real ingredients, hand-tossed the moment you order. Nothing sits under a heat lamp.',
    image: homemadeImg,
  },
  {
    title: 'Fast Delivery',
    description:
      "Hot, fresh, and at your door quickly — because pizza waits for no one.",
    image: deliveryImg,
  },
]

function WhyChooseUs() {
  const [openIndex, setOpenIndex] = useState(null)
  const [main, ...rest] = highlights
  const openItem = openIndex !== null ? highlights[openIndex] : null

  return (
    <section className="bg-[#f4ede1] py-24 px-8 overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl md:text-5xl text-center text-neutral-800 mb-20"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Why Tony Pizza
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          <button
            onClick={() => setOpenIndex(0)}
            className="md:col-span-7 md:mt-12 relative text-left cursor-pointer group"
          >
            <div className="h-80 md:h-[28rem] rounded-2xl overflow-hidden">
              <img
                src={main.image}
                alt={main.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 md:absolute md:-bottom-10 md:-right-8 md:w-80 mt-[-2rem] md:mt-0 relative z-10">
              <span className="text-5xl font-black text-neutral-800/10 leading-none block mb-2">
                01
              </span>
              <h3
                className="text-2xl font-bold italic text-neutral-800 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {main.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {main.description}
              </p>
            </div>
          </button>

          <div className="md:col-span-5 flex flex-col gap-6 md:gap-8 md:mt-0">
            {rest.map((item, i) => (
              <button
                key={item.title}
                onClick={() => setOpenIndex(i + 1)}
                className="flex gap-5 items-start text-left hover:opacity-70 transition-opacity cursor-pointer"
              >
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-3xl font-black text-neutral-800/10 leading-none block mb-1">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <h3
                    className="text-xl font-bold italic text-neutral-800 mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded overlay */}
      {openItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenIndex(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-neutral-800" />
            </button>

            <div className="h-72 md:h-96">
              <img
                src={openItem.image}
                alt={openItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
                <span className="text-5xl font-black text-neutral-800/10 leading-none block mb-2">
                    {String(openIndex + 1).padStart(2, '0')}
                </span>
                <h3
                    className="text-3xl font-bold italic text-neutral-800 mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {openItem.title}
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                    {openItem.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                    to="/menu"
                    className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-orange-600 transition-colors"
                    >
                    Order Now
                    </Link>
                    <Link
                    to="/login"
                    className="bg-neutral-100 text-neutral-800 px-6 py-3 rounded-full font-semibold text-center hover:bg-neutral-200 transition-colors"
                    >
                    Sign Up / Login
                    </Link>
                </div>
</div>


          
          </div>
        </div>
      )}
    </section>
  )
}

export default WhyChooseUs