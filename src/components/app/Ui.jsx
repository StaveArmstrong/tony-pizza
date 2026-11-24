import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMenuImage } from '../../utils/menuImages'
import { useCart } from '../../context/CartContext'

export const money = (n) => `$${Number(n || 0).toFixed(2)}`

export const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

export const STATUS_LABELS = {
  pending: 'Pending',
  preparing: 'Preparing',
  out_for_delivery: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const ACTIVE_STATUSES = ['pending', 'preparing', 'out_for_delivery']

export const orangeBtn =
  'inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold rounded-full px-6 py-3 hover:bg-orange-600 transition-colors disabled:opacity-60'

export const playfair = { fontFamily: "'Playfair Display', serif" }
export const script = { fontFamily: "'Dancing Script', cursive" }

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function StatusPill({ status }) {
  return (
    <span
      className={`ap-pill-${status} inline-block text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function Card({ title, icon: Icon, action, children, className = '' }) {
  return (
    <section className={`ap-card rounded-2xl p-5 md:p-6 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold italic ap-ink flex items-center gap-2" style={playfair}>
            {Icon && <Icon className="w-5 h-5 text-orange-500" />}
            {title}
          </h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold italic ap-ink flex items-center gap-2" style={playfair}>
        {Icon && <Icon className="w-5 h-5 text-orange-500" />}
        {title}
      </h2>
      {subtitle && <p className="text-sm ap-ink3 mt-0.5">{subtitle}</p>}
    </div>
  )
}

// Centered script heading, same look as "Our Menu" on the website
export function CenteredTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-4xl sm:text-5xl md:text-6xl ap-ink" style={script}>
        {title}
      </h2>
      {subtitle && <p className="ap-ink3 mt-2">{subtitle}</p>}
    </div>
  )
}

// Adds the chosen size to the cart and goes straight to the cart page
export function useOrderNow(item) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [sizeId, setSizeId] = useState(item.sizes[0]?.id)
  const size = item.sizes.find((s) => s.id === sizeId)
  const image = getMenuImage(item.name)

  const orderNow = () => {
    if (!size) {
      navigate('/menu')
      return
    }
    addItem({
      menuItemId: item.id,
      name: item.name,
      image,
      sizeId: size.id,
      sizeLabel: size.size,
      toppingIds: [],
      toppingsLabel: '',
      unitPrice: size.price,
    })
    navigate('/cart')
  }

  return { size, setSizeId, sizeId, image, orderNow }
}

export function ItemCard({ item, badge }) {
  const { size, sizeId, setSizeId, image, orderNow } = useOrderNow(item)

  return (
    <div className="ap-card rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="relative h-40 ap-card2 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl" aria-hidden="true">🍕</span>
        )}
        {badge && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-xl font-bold italic ap-ink" style={playfair}>{item.name}</h3>
        {(item.reason || item.note) && <p className="text-xs ap-ink3 mt-0.5">{item.reason || item.note}</p>}

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-lg font-bold ap-ink">{size ? money(size.price) : '—'}</span>
            {item.sizes.length > 1 && (
              <select
                value={sizeId}
                onChange={(e) => setSizeId(Number(e.target.value))}
                aria-label={`Size for ${item.name}`}
                className="ap-input rounded-full text-sm px-3 py-1.5"
              >
                {item.sizes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.size}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button onClick={orderNow} className={`${orangeBtn} w-full !py-2.5 text-sm`}>
            Order now
          </button>
        </div>
      </div>
    </div>
  )
}

// Cards swipe sideways on phones and sit in a grid on bigger screens
export function CardRow({ children, cols = 'lg:grid-cols-4' }) {
  return (
    <div
      className={`flex gap-4 overflow-x-auto snap-x scroll-pl-4 -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 ${cols} sm:overflow-visible`}
    >
      {children}
    </div>
  )
}

export function transactionLabel(tx) {
  if (tx.type === 'top_up') return 'Added money'
  if (tx.type === 'refund') return tx.order_id ? `Refund · Order #${tx.order_id}` : 'Refund'
  return tx.order_id ? `Order #${tx.order_id}` : 'Order payment'
}