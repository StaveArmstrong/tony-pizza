import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4ede1] flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <img src={logo} alt="Tony's Pizza" className="h-16 w-auto" style={{ mixBlendMode: 'multiply' }} />
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl text-center text-neutral-800 mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Reset Password
          </h1>

          {sent ? (
            <p className="text-center text-neutral-600 text-sm mt-6">
              If that email is registered, a reset link is on its way. Check your inbox.
            </p>
          ) : (
            <>
              <p className="text-center text-neutral-500 text-sm mb-8">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 outline-none focus:border-orange-400"
                  placeholder="you@example.com"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-full font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-neutral-500 mt-6">
            <Link to="/login" className="text-orange-500 font-semibold hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword