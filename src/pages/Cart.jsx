import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'

function Cart() {
  const { cartItems, removeItem, updateQuantity, cartTotal } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    navigate('/checkout')
  } else {
    navigate('/login', { state: { from: '/checkout' } })
  }
}

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4ede1] pt-32 pb-24 px-8 flex flex-col items-center justify-center text-center">
        <h1
          className="text-4xl text-neutral-800 mb-4"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Your cart is empty
        </h1>
        <p className="text-neutral-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link
          to="/menu"
          className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
        >
          Browse the Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4ede1] pt-32 pb-24 px-8">
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-4xl md:text-5xl text-center text-neutral-800 mb-12"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Your Cart
        </h1>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8">
          {cartItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-4 p-5 border-b border-neutral-100 last:border-0"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-neutral-400 text-[10px]">No photo</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className="text-lg font-bold italic text-neutral-800"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.name}
                </h3>
                <p className="text-sm text-neutral-500">
                  {item.sizeLabel}
                  {item.toppingsLabel ? ` · ${item.toppingsLabel}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQuantity(item.key, item.quantity - 1)}
                  className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center hover:border-orange-400 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.key, item.quantity + 1)}
                  className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center hover:border-orange-400 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <span className="w-20 text-right font-bold text-neutral-800 shrink-0">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </span>

              <button
                onClick={() => removeItem(item.key)}
                className="text-neutral-400 hover:text-red-500 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <span className="text-neutral-600">Subtotal</span>
            <span className="text-2xl font-bold text-neutral-800">${cartTotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-neutral-400 mb-6">
            Delivery fee and tax calculated at checkout.
          </p>
          <button
            onClick={handleCheckout}
            className="w-full bg-orange-500 text-white py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart