import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Wallet, Plus, Sparkles, Heart, ArrowDownLeft, ArrowUpRight, RotateCcw } from 'lucide-react'
import DashboardHeader from '../components/DashboardHeader'
import WalletTopUpModal from '../components/WalletTopUpModal'
import { getMenuImage } from '../utils/menuImages'

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  preparing: 'bg-blue-100 text-blue-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const money = (n) => `$${Number(n || 0).toFixed(2)}`

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function SectionCard({ title, icon: Icon, action, children }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-2xl font-bold italic text-neutral-800 flex items-center gap-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {Icon && <Icon className="w-5 h-5 text-orange-500" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-xs uppercase tracking-wide text-neutral-400 font-semibold mb-1">{label}</p>
      <p className="text-3xl font-bold text-neutral-800">{value}</p>
    </div>
  )
}

function ItemCard({ item, badge }) {
  const image = getMenuImage(item.name)

  return (
    <Link
      to="/menu"
      className="group rounded-xl border border-neutral-100 hover:border-orange-300 transition-colors overflow-hidden flex flex-col"
    >
      <div className="relative h-32 bg-orange-50 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-4xl" aria-hidden="true">🍕</span>
        )}
        {badge && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="font-semibold text-neutral-800">{item.name}</p>
        {item.reason && <p className="text-xs text-neutral-500 mt-0.5">{item.reason}</p>}
        {item.fromPrice !== null && item.fromPrice !== undefined && (
          <p className="text-sm text-orange-600 font-semibold mt-2">From {money(item.fromPrice)}</p>
        )}
      </div>
    </Link>
  )
}

function transactionLabel(tx) {
  if (tx.type === 'top_up') return 'Added money'
  if (tx.type === 'refund') return tx.order_id ? `Refund · Order #${tx.order_id}` : 'Refund'
  return tx.order_id ? `Order #${tx.order_id}` : 'Order payment'
}

function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTopUp, setShowTopUp] = useState(false)

  const load = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    try {
      const res = await fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } })

      if (res.status === 401) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        navigate('/login', { state: { from: '/dashboard' }, replace: true })
        return
      }
      if (!res.ok) throw new Error('Could not load your dashboard')

      setData(await res.json())
      setError('')
    } catch (err) {
      setError(err.message || 'Something went wrong loading your dashboard.')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    load()
  }, [load])

  const handleTopUpSuccess = () => {
    setShowTopUp(false)
    load()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4ede1]">
        <DashboardHeader />
        <p className="pt-24 text-center text-neutral-500">Loading your dashboard...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#f4ede1]">
        <DashboardHeader />
        <div className="max-w-md mx-auto pt-24 px-8 text-center">
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          <button onClick={load} className="text-orange-500 font-semibold">
            Try again
          </button>
        </div>
      </div>
    )
  }

  const { user, stats, recentOrders, favorites, topToppings, recommendations, newDrops, wallet } = data
  const firstName = user.name.split(' ')[0]
  const hasHistory = stats.orderCount > 0

  return (
    <div className="min-h-screen bg-[#f4ede1]">
      <DashboardHeader />

      <div className="max-w-6xl mx-auto pt-10 pb-24 px-4 md:px-8">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}

        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl text-neutral-800 mb-1" style={{ fontFamily: "'Dancing Script', cursive" }}>
              {greeting()}, {firstName}
            </h1>
            <p className="text-neutral-500 text-sm">
              {user.email} · Member since {formatDate(user.memberSince)}
            </p>
          </div>
          <Link
            to="/menu"
            className="self-start md:self-auto bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            Order now
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Orders" value={stats.orderCount} />
              <StatCard label="Total spent" value={money(stats.totalSpent)} />
              <StatCard label="Avg. order" value={hasHistory ? money(stats.averageOrder) : '—'} />
            </div>

            <SectionCard title="Order history" icon={Package}>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500 mb-5">You haven't placed an order yet.</p>
                  <Link
                    to="/menu"
                    className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Browse the menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/orders/${order.id}`}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl border border-neutral-100 hover:border-orange-300 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-800">
                          Order #{order.id}
                          <span className="font-normal text-neutral-400 text-sm"> · {formatDate(order.created_at)}</span>
                        </p>
                        <p className="text-sm text-neutral-500 truncate">
                          {order.items.length > 0
                            ? order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')
                            : 'No items'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-neutral-800">{money(order.total)}</span>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                            statusColors[order.status] || 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Recommended for you" icon={Heart}>
              {recommendations.length === 0 ? (
                <p className="text-neutral-500 text-sm">Nothing to suggest yet — check back after your next order.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {recommendations.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="New drops" icon={Sparkles}>
              {newDrops.length === 0 ? (
                <p className="text-neutral-500 text-sm">No new items this month. We'll show fresh additions here first.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {newDrops.map((item) => (
                    <ItemCard key={item.id} item={item} badge="New" />
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <section className="bg-neutral-900 text-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                <Wallet className="w-4 h-4" />
                Food wallet
              </div>
              <p className="text-4xl font-bold mb-4">{money(wallet.balance)}</p>
              <button
                onClick={() => setShowTopUp(true)}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors py-3 rounded-full font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add money
              </button>
              <p className="text-xs text-neutral-400 mt-3">Choose "Wallet" at checkout to pay from your balance.</p>

              {wallet.transactions.length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
                  {wallet.transactions.map((tx) => {
                    const amount = parseFloat(tx.amount)
                    const Icon = tx.type === 'refund' ? RotateCcw : amount >= 0 ? ArrowDownLeft : ArrowUpRight
                    return (
                      <div key={tx.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className="w-4 h-4 text-neutral-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="truncate">{transactionLabel(tx)}</p>
                            <p className="text-xs text-neutral-500">{formatDate(tx.created_at)}</p>
                          </div>
                        </div>
                        <span className={amount >= 0 ? 'text-green-400 font-semibold' : 'text-neutral-200 font-semibold'}>
                          {amount >= 0 ? '+' : '−'}
                          {money(Math.abs(amount))}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            <SectionCard title="Your taste" icon={Heart}>
              {favorites.length === 0 ? (
                <p className="text-neutral-500 text-sm">
                  Place a few orders and we'll learn what you love, then tailor your recommendations.
                </p>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-wide text-neutral-400 font-semibold mb-2">Most ordered</p>
                  <ol className="space-y-2 mb-5">
                    {favorites.map((f, i) => (
                      <li key={f.id} className="flex items-center justify-between text-sm">
                        <span className="text-neutral-800">
                          <span className="text-orange-500 font-bold mr-2">{i + 1}</span>
                          {f.name}
                        </span>
                        <span className="text-neutral-400">{f.times_ordered}×</span>
                      </li>
                    ))}
                  </ol>

                  {topToppings.length > 0 && (
                    <>
                      <p className="text-xs uppercase tracking-wide text-neutral-400 font-semibold mb-2">Favourite toppings</p>
                      <div className="flex flex-wrap gap-2">
                        {topToppings.map((t) => (
                          <span key={t.name} className="bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </SectionCard>
          </div>
        </div>
      </div>

      {showTopUp && <WalletTopUpModal onClose={() => setShowTopUp(false)} onSuccess={handleTopUpSuccess} />}
    </div>
  )
}

export default Dashboard