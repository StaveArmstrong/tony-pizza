import { useState, useEffect } from 'react'
import { Link, useParams, useOutletContext } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { StatusPill, money, script } from '../components/app/ui'

function OrderDetail() {
  const { id } = useParams()
  const { reload } = useOutletContext()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('accessToken')}` })

  useEffect(() => {
    fetch(`/api/orders/${id}`, { headers: headers() })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Could not load this order')
        setOrder(data.order)
        setItems(data.items || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order? If you paid from your wallet, the money goes back to your balance.')) return
    setCancelling(true)
    setError('')
    try {
      const res = await fetch(`/api/orders/${id}/cancel`, { method: 'PUT', headers: headers() })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Could not cancel this order.')
        return
      }
      setOrder(data)
      reload() // refresh wallet balance and stats after a possible refund
    } catch {
      setError('Something went wrong cancelling your order.')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/dashboard/orders"
        className="inline-flex items-center gap-2 ap-ink2 hover:text-orange-500 text-sm mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      {loading && <p className="ap-ink3 py-12 text-center">Loading order...</p>}
      {error && <div className="bg-red-500/10 text-red-500 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>}

      {order && (
        <div className="ap-card rounded-2xl p-5 md:p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl ap-ink" style={script}>
                Order #{order.id}
              </h1>
              <p className="text-sm ap-ink3">
                {new Date(order.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <StatusPill status={order.status} />
          </div>

          <div className="ap-divide mb-4">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 text-sm">
                <span className="ap-ink2">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-semibold ap-ink">{money(parseFloat(item.price_at_order) * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-sm border-t ap-line pt-4">
            <div className="flex justify-between ap-ink2">
              <span>Subtotal</span>
              <span>{money(order.subtotal)}</span>
            </div>
            <div className="flex justify-between ap-ink2">
              <span>Tax</span>
              <span>{money(order.tax)}</span>
            </div>
            <div className="flex justify-between ap-ink2">
              <span>Delivery</span>
              <span>{money(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold ap-ink pt-2">
              <span>Total</span>
              <span>{money(order.total)}</span>
            </div>
          </div>

          {order.status === 'pending' && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="mt-6 text-sm font-semibold text-red-500 hover:text-red-600 disabled:opacity-60"
            >
              {cancelling ? 'Cancelling...' : 'Cancel this order'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderDetail