import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { useCart } from '../context/CartContext'

function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const { cartCount } = useCart()
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'))

  const isTransparentPage = location.pathname === '/' || location.pathname === '/menu'

  useEffect(() => {
    if (!isTransparentPage) {
      setScrolled(true)
      return
    }

    setScrolled(false)
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isTransparentPage])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/about', label: 'About Us' },
  ]

  return (
    <nav
      className={`
        fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50
        flex items-center justify-between
        px-6 py-3 rounded-full
        transition-all duration-300
        ${
          scrolled
            ? 'bg-black/30 backdrop-blur-md border border-white/10 shadow-lg'
            : 'bg-transparent backdrop-blur-0 border border-transparent'
        }
      `}
    >
      <div className="flex items-center gap-4">
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="Tony's Pizza"
            className="h-12 md:h-13 w-auto"
            style={{ mixBlendMode: 'screen' }}
          />
        </Link>

        <div className="hidden md:flex items-center w-56 bg-white/10 rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-neutral-300" />

          <input
            type="text"
            placeholder="Search the menu..."
            className="bg-transparent outline-none text-white text-sm ml-2 w-full placeholder:text-neutral-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to

          return (
            <Link
              key={link.to}
              to={link.to}
              className={
                isActive
                  ? 'bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold'
                  : 'text-neutral-200 hover:text-white px-4 py-2 rounded-full text-sm font-medium'
              }
            >
              {link.label}
            </Link>
          )
        })}

        <Link to="/cart" className="relative text-neutral-200 hover:text-white p-2">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        <Link
          to={isLoggedIn ? '/dashboard' : '/login'}
          aria-label={isLoggedIn ? 'Your dashboard' : 'Log in'}
          title={isLoggedIn ? 'Your dashboard' : 'Log in'}
          className={`p-2 rounded-full ${
            isLoggedIn ? 'text-orange-400 hover:text-orange-300' : 'text-neutral-200 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  )
}

export default Navbar