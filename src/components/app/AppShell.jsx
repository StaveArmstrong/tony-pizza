import { useState, useEffect, useCallback, useRef } from 'react'
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  ClipboardList,
  Settings,
  UtensilsCrossed,
  Wallet,
  ShoppingCart,
  ChevronDown,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
} from 'lucide-react'
import logo from '../../assets/logo.png'
import WalletTopUpModal from '../WalletTopUpModal'
import { useCart } from '../../context/CartContext'
import { money, formatDate, greeting, script, orangeBtn, transactionLabel } from './ui'
import themeCss from './themeCss'

const NAV = [
  { to: '/dashboard', label: 'Home', icon: Home, end: true },
  { to: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

function WalletMenu({ wallet, openTopUp }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Food wallet"
        className="bg-white/10 hover:bg-white/20 border border-white/15 flex items-center gap-2 rounded-full pl-2.5 sm:pl-3 pr-2.5 py-1.5 text-sm transition-colors"
      >
        <Wallet className="w-4 h-4 text-orange-400" />
        <span className="font-semibold text-white">{money(wallet.balance)}</span>
        <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-neutral-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="ap-pop absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl p-5 z-50">
          <p className="text-xs uppercase tracking-wide ap-ink3 font-semibold">Food wallet</p>
          <p className="text-4xl font-bold ap-ink mb-4">{money(wallet.balance)}</p>

          <button
            onClick={() => {
              setOpen(false)
              openTopUp()
            }}
            className={`${orangeBtn} w-full`}
          >
            <Plus className="w-4 h-4" /> Add money
          </button>
          <p className="text-xs ap-ink3 mt-3">Choose "Wallet" at checkout to pay from your balance.</p>

          {wallet.transactions.length > 0 && (
            <div className="mt-4 pt-4 border-t ap-line space-y-3">
              {wallet.transactions.map((tx) => {
                const amount = parseFloat(tx.amount)
                const Icon = tx.type === 'refund' ? RotateCcw : amount >= 0 ? ArrowDownLeft : ArrowUpRight
                return (
                  <div key={tx.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 ap-ink3 shrink-0" />
                      <div className="min-w-0">
                        <p className="ap-ink truncate">{transactionLabel(tx)}</p>
                        <p className="text-xs ap-ink3">{formatDate(tx.created_at)}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${amount >= 0 ? 'text-green-500' : 'ap-ink'}`}>
                      {amount >= 0 ? '+' : '−'}
                      {money(Math.abs(amount))}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AppShell() {
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const location = useLocation()
  const isHome = location.pathname === '/dashboard'

  // Like the website: transparent over the hero, dark glass once you scroll (always glass on other pages)
  const [scrolled, setScrolled] = useState(!isHome)
  useEffect(() => {
    if (!isHome) {
      setScrolled(true)
      return
    }
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [showTopUp, setShowTopUp] = useState(false)

  // Light / dark / system, remembered on this device
  const [themePref, setThemePref] = useState(() => {
    try {
      return localStorage.getItem('tp-theme') || 'light'
    } catch {
      return 'light'
    }
  })
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  )
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const onChange = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  const dark = themePref === 'dark' || (themePref === 'system' && systemDark)
  const changeTheme = (pref) => {
    setThemePref(pref)
    try {
      localStorage.setItem('tp-theme', pref)
    } catch {
      // private mode: the choice just won't be remembered
    }
  }

  const clearSession = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  const reload = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })

      if (res.status === 401) {
        clearSession()
        navigate('/login', { state: { from: '/dashboard' }, replace: true })
        return
      }
      if (!res.ok) throw new Error('Could not load your dashboard')

      setData(await res.json())
      setError('')
    } catch (err) {
      setError(err.message || 'Something went wrong loading your dashboard.')
    }
  }, [navigate])

  useEffect(() => {
    reload()
  }, [reload])

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
    } catch {
      // clear the local session regardless
    }
    clearSession()
    navigate('/')
  }

  const firstName = data?.user?.name?.split(' ')[0] || ''
  const initial = (data?.user?.name || '?').charAt(0).toUpperCase()

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold'
      : 'text-white/90 hover:text-white px-4 py-2 rounded-full text-sm font-medium'

  return (
    <div className={`ap-root ${dark ? 'dark' : ''} min-h-screen`}>
      <style>{themeCss}</style>
      {/* Floating pill nav, same as the website. Logo + greeting on the left, links, cart and wallet on the right */}
      <nav
        style={{ top: 'calc(1.25rem + env(safe-area-inset-top))' }}
        className={`fixed left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-3 rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-black/50 backdrop-blur-md border border-white/10 shadow-lg'
            : 'bg-transparent border border-transparent'
        }`}
      >
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <Link to="/" className="shrink-0" aria-label="Tony's Pizza home">
            <img src={logo} alt="Tony's Pizza" className="h-10 sm:h-12 w-auto" style={{ mixBlendMode: 'screen' }} />
          </Link>

          <p className="min-w-0 truncate text-xl sm:text-2xl md:text-3xl leading-none text-white" style={script}>
            {firstName && (
              <>
                <span className="hidden sm:inline">{greeting()}, </span>
                <span className="sm:hidden">Hi, </span>
                {firstName}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <div className="hidden lg:flex items-center gap-1 mr-1">
            {NAV.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                {label}
              </NavLink>
            ))}
            <Link to="/menu" className="text-white/90 hover:text-white px-4 py-2 rounded-full text-sm font-medium">
              Menu
            </Link>
          </div>

          <Link to="/cart" aria-label="Cart" className="relative text-white/90 hover:text-white p-2">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {data && <WalletMenu wallet={data.wallet} openTopUp={() => setShowTopUp(true)} />}

          <Link
            to="/dashboard/settings"
            aria-label="Settings"
            className="hidden sm:flex ml-1 w-9 h-9 rounded-full bg-orange-500 text-white font-bold items-center justify-center"
          >
            {initial}
          </Link>
        </div>
      </nav>

      <main className={isHome ? 'pb-28 lg:pb-12' : 'px-4 md:px-8 pt-32 pb-28 lg:pb-12 max-w-6xl mx-auto'}>
        {error && !data ? (
          <div className={`max-w-md mx-auto text-center px-4 ${isHome ? 'pt-44' : 'pt-4'}`}>
            <div className="bg-red-500/10 text-red-500 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
            <button onClick={reload} className="text-orange-500 font-semibold">
              Try again
            </button>
          </div>
        ) : !data ? (
          <div className="animate-pulse">
            {isHome && <div className="h-[70vh] min-h-[420px] ap-card" />}
            <div className={isHome ? 'max-w-6xl mx-auto px-4 md:px-8 py-16' : ''}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="h-64 ap-card rounded-2xl" />
                <div className="h-64 ap-card rounded-2xl" />
                <div className="h-64 ap-card rounded-2xl hidden lg:block" />
                <div className="h-64 ap-card rounded-2xl hidden lg:block" />
              </div>
            </div>
          </div>
        ) : (
          <Outlet
            context={{ data, firstName, reload, logout, themePref, changeTheme, openTopUp: () => setShowTopUp(true) }}
          />
        )}
      </main>

      {/* Phone tab bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 ap-nav-bottom pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4">
          {[...NAV.slice(0, 2), { to: '/menu', label: 'Menu', icon: UtensilsCrossed }, NAV[2]].map(
            ({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                    isActive ? 'text-orange-500' : 'ap-ink3'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            )
          )}
        </div>
      </nav>

      {showTopUp && (
        <WalletTopUpModal
          dark={dark}
          onClose={() => setShowTopUp(false)}
          onSuccess={() => {
            setShowTopUp(false)
            reload()
          }}
        />
      )}
    </div>
  )
}

export default AppShell