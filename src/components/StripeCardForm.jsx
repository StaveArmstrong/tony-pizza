import { useState, useEffect, useMemo } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Lock, AlertTriangle } from 'lucide-react'
import stripePromise from '../lib/stripe'

// A card payment form that always tells the customer what is going on:
// - shows "loading" until the card fields are really there
// - shows Stripe's own error if the keys don't match or Stripe can't be reached
// - never gets stuck on "Processing..."
// - shows the Stripe test card details while you are in test mode

function Problem({ title, children }) {
  return (
    <div className="rounded-xl border border-red-300/60 bg-red-500/10 text-red-500 px-4 py-3 text-sm">
      <p className="font-semibold flex items-center gap-2 mb-1">
        <AlertTriangle className="w-4 h-4 shrink-0" /> {title}
      </p>
      <div className="space-y-1.5 opacity-90">{children}</div>
    </div>
  )
}

function CardFields({ clientSecret, submitLabel, onPaid, buttonClass }) {
  const stripe = useStripe()
  const elements = useElements()
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [slow, setSlow] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Ask Stripe about this payment first. This catches the most common setup mistake
  // (publishable key and secret key from different Stripe accounts) with a clear message.
  useEffect(() => {
    if (!stripe) return
    let alive = true
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent, error: probeError }) => {
      if (!alive) return
      if (probeError) {
        setLoadError(probeError.message || 'Stripe could not find this payment.')
        return
      }
      setTestMode(Boolean(paymentIntent) && !paymentIntent.livemode)
    })
    return () => {
      alive = false
    }
  }, [stripe, clientSecret])

  // If the card fields still haven't appeared after 10 seconds, say so
  useEffect(() => {
    if (ready || loadError) return
    const timer = setTimeout(() => setSlow(true), 10000)
    return () => clearTimeout(timer)
  }, [ready, loadError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || !ready || submitting) return
    setSubmitting(true)
    setError('')

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.')
        return
      }
      if (paymentIntent?.status !== 'succeeded') {
        setError('Payment did not complete. Please try again.')
        return
      }

      await onPaid(paymentIntent)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadError) {
    return (
      <Problem title="The card form could not be loaded">
        <p>Stripe says: “{loadError}”</p>
        <p>
          If you are the developer: the publishable key in <code>src/lib/stripe.js</code> and{' '}
          <code>STRIPE_SECRET_KEY</code> in the backend <code>.env</code> must come from the{' '}
          <strong>same Stripe account</strong> and the same mode (both test, or both live).
        </p>
      </Problem>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {testMode && (
        <div className="rounded-xl bg-orange-500/10 text-orange-600 px-4 py-3 text-xs leading-relaxed">
          <p className="font-semibold mb-0.5">Test mode: no real money is used</p>
          <p>
            Card <strong>4242 4242 4242 4242</strong> · any future date (e.g. 12/34) · any 3 digits for CVC
          </p>
        </div>
      )}

      {!ready && !slow && <p className="text-sm opacity-70 animate-pulse">Loading secure card form…</p>}
      {!ready && slow && (
        <Problem title="The card form is taking too long">
          <p>Check your internet connection, and turn off any ad-blocker or VPN for this page, then reload.</p>
        </Problem>
      )}

      <PaymentElement
        onReady={() => setReady(true)}
        onLoadError={(event) => setLoadError(event?.error?.message || 'The card form could not be loaded.')}
      />

      {error && <div className="bg-red-500/10 text-red-500 text-sm rounded-lg px-4 py-3">{error}</div>}

      <button type="submit" disabled={!stripe || !ready || submitting} className={buttonClass}>
        {submitting ? 'Processing...' : submitLabel}
      </button>

      <p className="text-center text-xs opacity-60 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3" /> Card details go straight to Stripe. We never see them.
      </p>
    </form>
  )
}

export default function StripeCardForm({ clientSecret, submitLabel, onPaid, buttonClass, dark = false }) {
  const [stripeFailed, setStripeFailed] = useState(false)

  // Stripe's script could not be downloaded at all (offline, blocked by an ad-blocker, ...)
  useEffect(() => {
    let alive = true
    stripePromise
      .then((stripe) => {
        if (alive && !stripe) setStripeFailed(true)
      })
      .catch(() => alive && setStripeFailed(true))
    return () => {
      alive = false
    }
  }, [])

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: dark ? 'night' : 'stripe',
        variables: { colorPrimary: '#f97316', borderRadius: '10px' },
      },
    }),
    [clientSecret, dark]
  )

  if (stripeFailed) {
    return (
      <Problem title="We couldn't reach Stripe">
        <p>The card form comes from Stripe and could not be loaded.</p>
        <p>Check your internet connection and turn off any ad-blocker or VPN for this page, then reload.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-1 font-semibold underline underline-offset-2"
        >
          Reload the page
        </button>
      </Problem>
    )
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CardFields clientSecret={clientSecret} submitLabel={submitLabel} onPaid={onPaid} buttonClass={buttonClass} />
    </Elements>
  )
}