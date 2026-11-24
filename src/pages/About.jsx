import { Link } from 'react-router-dom'
import { Flame, Leaf, Bike } from 'lucide-react'

// NOTE: this copy is generic placeholder text. Replace it with Tony's real story.
const values = [
  {
    icon: Flame,
    title: 'Baked to order',
    text: 'Every pizza is made when you order it, so it reaches you hot and fresh.',
  },
  {
    icon: Leaf,
    title: 'Honest ingredients',
    text: 'Simple, quality ingredients and dough made with care, nothing more than it needs to be.',
  },
  {
    icon: Bike,
    title: 'Delivered with care',
    text: 'Quick delivery to your door, with your order tracked from the oven to your table.',
  },
]

function About() {
  return (
    <div className="min-h-screen bg-[#f4ede1] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-5xl text-neutral-800 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
            About Tony's Pizza
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            We make pizza the way it should be: fresh dough, good ingredients, and a kitchen that cares about every order
            that leaves it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-orange-500" />
              </div>
              <h2
                className="text-xl font-bold italic text-neutral-800 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {title}
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10 text-center">
          <h2
            className="text-2xl font-bold italic text-neutral-800 mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Hungry?
          </h2>
          <p className="text-neutral-600 mb-6">Have a look at the menu and place your first order.</p>
          <Link
            to="/menu"
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            See the menu
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About