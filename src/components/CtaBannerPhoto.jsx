import { Link } from 'react-router-dom'
import heroBg from '../assets/hero.bg.jpg'

function CtaBannerPhoto() {
  return (
    <section
      className="relative py-32 px-8 bg-cover bg-center flex items-center justify-center text-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-2xl">
        <h2
          className="text-4xl md:text-6xl font-bold italic text-white mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Hungry Yet?
        </h2>
        <p className="text-lg md:text-xl text-neutral-200 mb-10">
          Fresh, hand-tossed pizza is one call or one click away.
        </p>
        <Link
          to="/menu"
          className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors"
        >
          Order Now
        </Link>
      </div>
    </section>
  )
}

export default CtaBannerPhoto