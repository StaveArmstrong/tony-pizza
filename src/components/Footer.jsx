import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react'
import logo from '../assets/logo.png'

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.061C22 6.505 17.523 2 12 2S2 6.505 2 12.061c0 5.022 3.657 9.184 8.438 9.939v-7.03H7.898v-2.909h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.755 8.437-4.917 8.437-9.939z" />
    </svg>
  )
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-6xl mx-auto pt-16 pb-8 px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img
                src={logo}
                alt="Tony's Pizza"
                className="h-12 w-auto"
                style={{ mixBlendMode: 'screen' }}
              />

              <span
                className="text-3xl text-white"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Tony Pizza
              </span>
            </Link>

            <p className="text-neutral-400 leading-relaxed max-w-sm mb-6">
              Fresh, hand-tossed pizza made to order. Family-run, wood-fired,
              always fresh — delivered hot, or order by voice and skip the wait.
            </p>

            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-orange-500 hover:text-white transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-orange-500 hover:text-white transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-orange-500 hover:text-white transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-white font-semibold mb-5">
              Quick Links
            </h4>

            <div className="flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="hover:text-white transition-colors"
              >
                Home
              </Link>

              <Link
                to="/menu"
                className="hover:text-white transition-colors"
              >
                Menu
              </Link>

              <Link
                to="/about"
                className="hover:text-white transition-colors"
              >
                About Us
              </Link>

              <Link
                to="/cart"
                className="hover:text-white transition-colors"
              >
                Cart
              </Link>
            </div>

            {/* Newsletter */}
            <div className="mt-8 pt-6 border-t border-neutral-800">
              <h3
                className="text-2xl text-white mb-1"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Stay in the loop
              </h3>

              <p className="text-neutral-500 text-xs leading-relaxed mb-4">
                Deals, new pizzas, and occasional surprises.
              </p>

              <form className="flex w-full">
                <input
                  type="email"
                  placeholder="Your email"
                  className="min-w-0 flex-1 bg-neutral-800 text-white placeholder:text-neutral-500 px-4 py-2.5 rounded-l-full outline-none text-xs"
                />

                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-4 rounded-r-full flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Visit Us */}
          <div className="md:col-span-4">
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">
              Visit Us
            </h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-orange-500" />
                <span>123 Placeholder St, Your City</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-orange-500" />
                <span>(000) 000-0000</span>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-orange-500" />
                <span>Mon–Sun: 11am – 10pm</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 mt-16 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <span>
            © {new Date().getFullYear()} Tony Pizza. All rights reserved.
          </span>

          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="hover:text-neutral-300 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer