import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import useRecaptcha from '../hooks/useRecaptcha'

function isPasswordValid(password) {
  return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)
}

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { containerRef, getToken, reset } = useRecaptcha()

  const redirectTo = location.state?.from || '/dashboard'

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  if (!isPasswordValid(password)) {
    setError('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.')
    return
  }

  const captchaToken = getToken()
  if (!captchaToken) {
    setError('Please complete the captcha.')
    return
  }

  setLoading(true)

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, captchaToken }),
    })

    if (res.status === 429) {
      setError('Too many attempts. Please wait a minute and try again.')
      reset()
      return
    }

    const data = await res.json()

    if (!res.ok) {
      const message = data.errors?.[0]?.msg || data.message || 'Could not create your account.'
      setError(message)
      reset()
      return
    }

    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('user', JSON.stringify(data.user))

    navigate(redirectTo)
  } catch {
    setError('Something went wrong. Check your connection and try again.')
    reset()
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
          <h1
            className="text-3xl text-center text-neutral-800 mb-2"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Join Tony Pizza
          </h1>
          <p className="text-center text-neutral-500 text-sm mb-8">
            Create an account to start ordering
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 outline-none focus:border-orange-400 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 outline-none focus:border-orange-400 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 outline-none focus:border-orange-400 transition-colors"
                placeholder="••••••••"
              />
              <p className="text-xs text-neutral-400 mt-1.5">
                At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
              </p>
            </div>

            <div ref={containerRef} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3.5 rounded-full font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" state={location.state} className="text-orange-500 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register