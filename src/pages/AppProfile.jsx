import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { MapPin, Trash2, LogOut, Globe } from 'lucide-react'
import { Card, formatDate, primaryBtn } from '../../components/app/ui'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
})

const inputClass =
  'w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-300 text-neutral-800 placeholder-neutral-400 outline-none focus:border-orange-500 text-sm'

const emptyForm = { street: '', city: '', state: '', postalCode: '', isDefault: false }

function AppProfile() {
  const { data, logout } = useOutletContext()
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
      .then(setAddresses)
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
      // Reload so the default address ordering is right
      const list = await fetch('/api/addresses', { headers: authHeaders() }).then((r) => r.json())
      setAddresses(list)
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
    <div className="space-y-6 max-w-2xl">
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-500 text-white text-2xl font-bold flex items-center justify-center shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-neutral-800 truncate">{user.name}</p>
            <p className="text-sm text-neutral-600 truncate">{user.email}</p>
            <p className="text-xs text-neutral-400 mt-0.5">Member since {formatDate(user.memberSince)}</p>
          </div>
        </div>
      </Card>

      <Card
        title="Delivery addresses"
        icon={MapPin}
        action={
          !showForm && (
            <button onClick={() => setShowForm(true)} className="text-sm text-orange-600 font-semibold">
              Add new
            </button>
          )
        }
      >
        {loading ? (
          <p className="text-neutral-400 text-sm">Loading...</p>
        ) : addresses.length === 0 && !showForm ? (
          <p className="text-neutral-600 text-sm">No saved addresses yet.</p>
        ) : (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-neutral-50">
                <div className="min-w-0">
                  <p className="text-sm text-neutral-800 truncate">
                    {addr.street}, {addr.city}
                    {addr.state ? `, ${addr.state}` : ''} {addr.postal_code}
                  </p>
                  {addr.is_default && <p className="text-xs text-orange-600 font-semibold">Default</p>}
                </div>
                <button
                  onClick={() => handleDelete(addr.id)}
                  aria-label="Remove address"
                  className="text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAdd} className="mt-4 space-y-3">
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
            <input
              className={inputClass}
              placeholder="Street address"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputClass}
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="State (optional)"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
            <input
              className={inputClass}
              placeholder="Postal code"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              />
              Make this my default address
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className={primaryBtn}>
                {saving ? 'Saving...' : 'Save address'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setForm(emptyForm)
                  setError('')
                }}
                className="px-5 py-3 rounded-xl text-neutral-600 hover:text-neutral-900 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:hidden">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-semibold"
        >
          <Globe className="w-4 h-4" /> Website
        </Link>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-semibold"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </div>
  )
}

export default AppProfile