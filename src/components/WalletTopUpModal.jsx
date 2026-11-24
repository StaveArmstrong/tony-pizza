import { useState } from 'react'
import { X, ArrowLeft } from 'lucide-react'
import StripeCardForm from './StripeCardForm'

const PRESETS = [10, 20, 50, 100]
const MIN_TOP_UP = 5
const MAX_TOP_UP = 200 // the server enforces these too

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
})

const payBtn =
  'w-full bg-orange-500 text-white py-3.5 rounded-full font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60'

function WalletTopUpModal({ onClose, onSuccess, dark = false }) {
  const [amount, setAmount] = useState(20)
  const [custom, setCustom] = useState('')
  const [clientSecret, setClientSecret] = useState(null)
  const [paymentIntentId, setPaymentIntentId] = useState(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')

  const chosenAmount = custom !== '' ? Number(custom) : amount
  const validAmount = Number.isFinite(chosenAmount) && chosenAmount >= MIN_TOP_UP && chosenAmount <= MAX_TOP_UP

  // Runs after Stripe confirms the card payment: ask our server to credit the wallet.
  // (The server re-checks the payment with Stripe itself, so the browser can't fake it.)
  const creditWallet = async () => {
    const res = await fetch('/api/wallet/topup/confirm', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ paymentIntentId }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(
        data.message || 'Your card was charged but we could not update your balance yet. Please refresh in a moment.'
      )
    }
    onSuccess()
  }

  const handleContinue = async () => {
    if (!validAmount) {
      setError(`Enter an amount between $${MIN_TOP_UP} and $${MAX_TOP_UP}.`)
      return
    }
    setStarting(true)
    setError('')
    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ amount: chosenAmount }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Could not start the top-up.')
        return
      }
      setClientSecret(data.clientSecret)
      setPaymentIntentId(data.paymentIntentId)
    } catch {
      setError('Something went wrong. Check your connection and try again.')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-4" onClick={onClose}>
      <div
        className="ap-pop rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold italic ap-ink" style={{ fontFamily: "'Playfair Display', serif" }}>
            Add money
          </h2>
          <button onClick={onClose} className="ap-ink3 hover:text-orange-500" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!clientSecret ? (
          <>
            <p className="text-sm ap-ink2 mb-4">Top up your food wallet, then pay for orders in one tap.</p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setAmount(p)
                    setCustom('')
                    setError('')
                  }}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                    custom === '' && amount === p
                      ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                      : 'ap-line ap-ink2 hover:border-orange-400'
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>

            <input
              type="number"
              min={MIN_TOP_UP}
              max={MAX_TOP_UP}
              step="1"
              placeholder="Other amount"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value)
                setError('')
              }}
              className="ap-input w-full px-4 py-2.5 rounded-lg text-sm mb-2"
            />
            <p className="text-xs ap-ink3 mb-5">
              Between ${MIN_TOP_UP} and ${MAX_TOP_UP} per top-up.
            </p>

            {error && <div className="bg-red-500/10 text-red-500 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

            <button onClick={handleContinue} disabled={starting} className={payBtn}>
              {starting ? 'Please wait...' : 'Continue to payment'}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setClientSecret(null)
                setPaymentIntentId(null)
              }}
              className="flex items-center gap-1.5 text-sm ap-ink3 hover:text-orange-500 mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Change amount
            </button>
            <StripeCardForm
              clientSecret={clientSecret}
              dark={dark}
              submitLabel={`Add $${chosenAmount.toFixed(2)}`}
              buttonClass={payBtn}
              onPaid={creditWallet}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default WalletTopUpModal