import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, CreditCard, Wallet } from 'lucide-react'
import { useCart } from '../context/CartContext'
import StripeCardForm from '../components/StripeCardForm'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
})

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [phase, setPhase] = useState('review') // 'review' | 'payment'
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', postalCode: '' })

  const [orderId, setOrderId] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)

  const [payMethod, setPayMethod] = useState('card') // 'card' | 'wallet'
  const [walletBalance, setWalletBalance] = useState(0)

  // Mirrors the server's tax and delivery fee. The server calculates the real total.
  const estimatedTotal = cartTotal * 1.075 + 2.5
  const walletCovers = walletBalance >= estimatedTotal

  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/wallet', { headers: authHeaders() })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setWalletBalance(data.balance)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/addresses', { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error('Could not load addresses')
        return res.json()
      })
      .then((data) => {
        setAddresses(data)
        const defaultAddr = data.find((a) => a.is_default) || data[0]
        if (defaultAddr) setSelectedAddressId(defaultAddr.id)
        else setShowAddForm(true)
      })
      .catch(() => setError('Could not load your saved addresses.'))
      .finally(() => setLoading(false))
  }, [])

  const handleAddAddress = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Could not save address.')
        return
      }
      setAddresses((prev) => [...prev, data])
      setSelectedAddressId(data.id)
      setShowAddForm(false)
      setNewAddress({ street: '', city: '', state: '', postalCode: '' })
    } catch {
      setError('Something went wrong saving your address.')
    }
  }

  const handleContinueToPayment = async () => {
    if (!selectedAddressId) {
      setError('Please select or add a delivery address.')
      return
    }
    setPlacing(true)
    setError('')

    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            menuItemId: item.menuItemId,
            sizeId: item.sizeId,
            quantity: item.quantity,
            toppingIds: item.toppingIds,
          })),
          deliveryAddressId: selectedAddressId,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        setError(orderData.message || 'Could not create your order.')
        setPlacing(false)
        return
      }

      const newOrderId = orderData.order.id
      setOrderId(newOrderId)

      if (payMethod === 'wallet') {
        const walletRes = await fetch('/api/wallet/pay', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ orderId: newOrderId }),
        })
        const walletData = await walletRes.json()
        if (!walletRes.ok) {
          setError(walletData.message || 'Could not pay from your wallet.')
          setPlacing(false)
          return
        }
        clearCart()
        navigate(`/orders/${newOrderId}`)
        return
      }

      const paymentRes = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ orderId: newOrderId }),
      })
      const paymentData = await paymentRes.json()
      if (!paymentRes.ok) {
        setError(paymentData.message || 'Could not start payment.')
        setPlacing(false)
        return
      }

      setClientSecret(paymentData.clientSecret)
      setPhase('payment')
    } catch {
      setError('Something went wrong placing your order.')
    } finally {
      setPlacing(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    navigate(`/orders/${orderId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4ede1] pt-32 pb-24 px-8 text-center text-neutral-500">
        Loading checkout...
      </div>
    )
  }

  if (cartItems.length === 0 && phase === 'review') {
    return (
      <div className="min-h-screen bg-[#f4ede1] pt-32 pb-24 px-8 text-center">
        <p className="text-neutral-500">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4ede1] pt-32 pb-24 px-8">
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-4xl text-center text-neutral-800 mb-10"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Checkout
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>
        )}

        {phase === 'review' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold italic text-neutral-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Delivery Address
              </h2>

              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border mb-2 cursor-pointer transition-colors ${
                    selectedAddressId === addr.id ? 'border-orange-400 bg-orange-50' : 'border-neutral-200'
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1"
                  />
                  <span className="text-sm text-neutral-700">
                    {addr.street}, {addr.city}
                    {addr.state ? `, ${addr.state}` : ''} {addr.postal_code}
                  </span>
                </label>
              ))}

              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 text-orange-500 font-semibold text-sm mt-2"
                >
                  <Plus className="w-4 h-4" /> Add a new address
                </button>
              ) : (
                <form onSubmit={handleAddAddress} className="space-y-3 mt-4 border-t border-neutral-100 pt-4">
                  <input
                    required
                    placeholder="Street address"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 outline-none focus:border-orange-400 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-neutral-300 outline-none focus:border-orange-400 text-sm"
                    />
                    <input
                      placeholder="State (optional)"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-neutral-300 outline-none focus:border-orange-400 text-sm"
                    />
                  </div>
                  <input
                    required
                    placeholder="Postal code"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 outline-none focus:border-orange-400 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold"
                  >
                    Save Address
                  </button>
                </form>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold italic text-neutral-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Order Summary
              </h2>
              {cartItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-neutral-700">
                    {item.quantity}× {item.name} ({item.sizeLabel})
                  </span>
                  <span className="font-semibold text-neutral-800">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-neutral-100 mt-3 pt-3 flex items-center justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="text-xl font-bold text-neutral-800">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Tax (7.5%) and a $2.50 delivery fee are added at payment.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold italic text-neutral-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Pay with
              </h2>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border mb-2 cursor-pointer transition-colors ${
                  payMethod === 'card' ? 'border-orange-400 bg-orange-50' : 'border-neutral-200'
                }`}
              >
                <input type="radio" checked={payMethod === 'card'} onChange={() => setPayMethod('card')} />
                <CreditCard className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-700">Card</span>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  payMethod === 'wallet' ? 'border-orange-400 bg-orange-50' : 'border-neutral-200'
                } ${!walletCovers ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  checked={payMethod === 'wallet'}
                  disabled={!walletCovers}
                  onChange={() => setPayMethod('wallet')}
                />
                <Wallet className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-700 flex-1">Wallet · ${walletBalance.toFixed(2)} available</span>
                {!walletCovers && (
                  <Link to="/dashboard" className="text-xs text-orange-500 font-semibold">
                    Add money
                  </Link>
                )}
              </label>
            </div>

            <button
              onClick={handleContinueToPayment}
              disabled={placing}
              className="w-full bg-orange-500 text-white py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {placing
                ? 'Placing Order...'
                : payMethod === 'wallet'
                  ? 'Pay from Wallet'
                  : 'Continue to Payment'}
            </button>
          </>
        )}

        {phase === 'payment' && clientSecret && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold italic text-neutral-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Payment
            </h2>
            <StripeCardForm
              clientSecret={clientSecret}
              submitLabel="Pay Now"
              buttonClass="w-full bg-orange-500 text-white py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors disabled:opacity-60"
              onPaid={handlePaymentSuccess}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout