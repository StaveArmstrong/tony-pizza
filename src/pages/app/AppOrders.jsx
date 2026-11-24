import { useState, useEffect, useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Package, Heart } from 'lucide-react'
import { Card, StatusPill, ACTIVE_STATUSES, money, formatDate, orangeBtn } from '../../components/app/ui'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

function matches(order, filter) {
  if (filter === 'all') return true
  if (filter === 'active') return ACTIVE_STATUSES.includes(order.status)
  return order.status === filter
}

function Stat({ label, value }) {
  return (
    <div className="ap-card rounded-2xl p-4 md:p-5">
      <p className="text-[11px] uppercase tracking-wide ap-ink3 font-semibold mb-1">{label}</p>
      <p className="text-xl md:text-3xl font-bold ap-ink">{value}</p>
    </div>
  )
}

function AppOrders() {
  const { data } = useOutletContext()
  const { stats, favorites, topToppings } = data

  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const loadPage = useCallback(async (p) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/orders?page=${p}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })
      if (!res.ok) throw new Error('Could not load your orders')
      const result = await res.json()
      setOrders((prev) => (p === 1 ? result.orders : [...prev, ...result.orders]))
      setHasMore(result.hasMore)
      setPage(p)
      setError('')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPage(1)
  }, [loadPage])

  const visible = orders.filter((o) => matches(o, filter))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Stat label="Orders" value={stats.orderCount} />
        <Stat label="Total spent" value={money(stats.totalSpent)} />
        <Stat label="Avg. order" value={stats.orderCount > 0 ? money(stats.averageOrder) : '—'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Your taste: above the list on phones, beside it on desktop */}
        <Card title="Your taste" icon={Heart} className="lg:order-2">
          {favorites.length === 0 ? (
            <p className="ap-ink2 text-sm">
              Place a few orders and we'll learn what you love, then tailor your recommendations.
            </p>
          ) : (
            <>
              <p className="text-[11px] uppercase tracking-wide ap-ink3 font-semibold mb-2">Most ordered</p>
              <ol className="space-y-2 mb-5">
                {favorites.map((f, i) => (
                  <li key={f.id} className="flex items-center justify-between text-sm">
                    <span className="ap-ink">
                      <span className="text-orange-500 font-bold mr-2">{i + 1}</span>
                      {f.name}
                    </span>
                    <span className="ap-ink3">{f.times_ordered}×</span>
                  </li>
                ))}
              </ol>

              {topToppings.length > 0 && (
                <>
                  <p className="text-[11px] uppercase tracking-wide ap-ink3 font-semibold mb-2">Favourite toppings</p>
                  <div className="flex flex-wrap gap-2">
                    {topToppings.map((t) => (
                      <span
                        key={t.name}
                        className="bg-orange-500/10 text-orange-500 text-xs font-semibold px-3 py-1.5 rounded-full"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </Card>

        <div className="lg:col-span-2 lg:order-1 space-y-4">
          <div className="flex gap-2 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-colors ${
                  filter === f.key
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'ap-card ap-line ap-ink2 hover:border-orange-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {error && <div className="bg-red-500/10 text-red-500 text-sm rounded-lg px-4 py-3">{error}</div>}

          <div className="ap-card rounded-2xl overflow-hidden ap-divide">
            {visible.map((order) => (
              <Link
                key={order.id}
                to={`/dashboard/orders/${order.id}`}
                className="ap-hover flex items-center justify-between gap-4 px-5 py-4 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-semibold ap-ink">
                    Order #{order.id}
                    <span className="font-normal ap-ink3 text-sm"> · {formatDate(order.created_at)}</span>
                  </p>
                  <p className="text-sm ap-ink2 truncate">
                    {order.items.length > 0
                      ? order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')
                      : 'No items'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-bold ap-ink">{money(order.total)}</span>
                  <StatusPill status={order.status} />
                </div>
              </Link>
            ))}

            {!loading && visible.length === 0 && (
              <div className="text-center py-12 px-6">
                <Package className="w-10 h-10 ap-ink3 mx-auto mb-3" />
                <p className="ap-ink2 mb-5">
                  {orders.length === 0 ? "You haven't placed an order yet." : 'No orders match this filter.'}
                </p>
                {orders.length === 0 && (
                  <Link to="/menu" className={orangeBtn}>
                    Browse the menu
                  </Link>
                )}
              </div>
            )}

            {loading && <p className="text-center ap-ink3 text-sm py-6">Loading...</p>}
          </div>

          {hasMore && !loading && (
            <button
              onClick={() => loadPage(page + 1)}
              className="w-full py-3 rounded-full border ap-line ap-card ap-ink2 font-semibold hover:border-orange-400 transition-colors"
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppOrders