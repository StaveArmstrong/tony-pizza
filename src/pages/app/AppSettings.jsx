import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Sun, Moon, Monitor, MapPin, Trash2, LogOut, Globe } from 'lucide-react'
import { Card, formatDate, orangeBtn } from '../../components/app/ui'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
})

const THEMES = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'system', label: 'Match device', icon: Monitor },
]

const emptyForm = { street: '', city: '', state: '', postalCode: '', isDefault: false }

function AppSettings() {
  const { data, logout, themePref, changeTheme } = useOutletContext()
  const { user } = data

  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/addresses', { headers: authHeaders() })
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => setAddresses(Array.isArray(list) ? list : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.street.trim() || !form.city.trim() || !form.postalCode.trim()) {
      setError('Street, city and postal code are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.message || result.errors?.[0]?.msg || 'Could not save the address.')
        return
      }
      const list = await fetch('/api/addresses', { headers: authHeaders() }).then((r) => r.json())
      setAddresses(Array.isArray(list) ? list : [])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this address?')) return
    const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (res.ok) setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="Appearance">
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => changeTheme(key)}
              aria-pressed={themePref === key}
              className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 text-sm font-semibold transition-colors ${
                themePref === key
                  ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                  : 'ap-line ap-card2 ap-ink2 hover:border-orange-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Account">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-orange-500 text-white text-xl font-bold flex items-center justify-center shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold ap-ink truncate">{user.name}</p>
            <p className="text-sm ap-ink2 truncate">{user.email}</p>
            <p className="text-xs ap-ink3 mt-0.5">Member since {formatDate(user.memberSince)}</p>
          </div>
        </div>
      </Card>

      <Card
        title="Delivery addresses"
        icon={MapPin}
        action={
          !showForm && (
            <button onClick={() => setShowForm(true)} className="text-sm text-orange-500 font-semibold">
              Add new
            </button>
          )
        }
      >
        {loading ? (
          <p className="ap-ink3 text-sm">Loading...</p>
        ) : addresses.length === 0 && !showForm ? (
          <p className="ap-ink2 text-sm">No saved addresses yet.</p>
        ) : (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="ap-card2 flex items-center justify-between gap-3 p-3 rounded-xl">
                <div className="min-w-0">
                  <p className="text-sm ap-ink truncate">
                    {addr.street}, {addr.city}
                    {addr.state ? `, ${addr.state}` : ''} {addr.postal_code}
                  </p>
                  {addr.is_default && <p className="text-xs text-orange-500 font-semibold">Default</p>}
                </div>
                <button
                  onClick={() => handleDelete(addr.id)}
                  aria-label="Remove address"
                  className="ap-ink3 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAdd} className="mt-4 space-y-3">
            {error && <div className="bg-red-500/10 text-red-500 text-sm rounded-lg px-4 py-3">{error}</div>}
            <input
              className="ap-input w-full px-4 py-2.5 rounded-lg text-sm"
              placeholder="Street address"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="ap-input w-full px-4 py-2.5 rounded-lg text-sm"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                className="ap-input w-full px-4 py-2.5 rounded-lg text-sm"
                placeholder="State (optional)"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
            <input
              className="ap-input w-full px-4 py-2.5 rounded-lg text-sm"
              placeholder="Postal code"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm ap-ink2">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              />
              Make this my default address
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className={orangeBtn}>
                {saving ? 'Saving...' : 'Save address'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setForm(emptyForm)
                  setError('')
                }}
                className="px-5 py-3 rounded-full ap-ink2 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Card>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          to="/"
          className="ap-card ap-line border flex items-center justify-center gap-2 py-3 rounded-full ap-ink2 font-semibold hover:border-orange-400 transition-colors"
        >
          <Globe className="w-4 h-4" /> Back to website
        </Link>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 py-3 rounded-full border border-red-500/50 text-red-500 font-semibold hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </div>
  )
}

export default AppSettings