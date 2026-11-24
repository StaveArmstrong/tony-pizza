import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'

function isPasswordValid(password) {
  return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)
}

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isPasswordValid(password)) {
      setError('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Could not reset your password.')
        return
      }

      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f4ede1] flex items-center justify-center px-8 text-center">
        <p className="text-neutral-600">This reset link is missing a token. Please request a new one.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4ede1] flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <img src={logo} alt="Tony's Pizza" className="h-16 w-auto" style={{ mixBlendMode: 'multiply' }} />
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl text-center text-neutral-800 mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Set New Password
          </h1>

          {success ? (
            <p className="text-center text-green-600 text-sm mt-6">
              Password updated! Redirecting you to login...
            </p>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6 mt-6">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 outline-none focus:border-orange-400"
                  placeholder="New password"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-full font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword