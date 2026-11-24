// Keeps logged-in users logged in.
//
// Your access token only lasts 15 minutes. When any /api call comes back 401
// ("Unauthorized"), this asks the server for a fresh token using the refresh token
// (valid for 7 days) and repeats the original request. The user never notices.
// If the refresh token is also dead, the session is cleared and they are sent to log in.
//
// It wraps window.fetch once, so no other file needs to change.

const nativeFetch = window.fetch.bind(window)
let refreshing = null

const PROTECTED_PREFIXES = ['/dashboard', '/checkout', '/orders']

function clearSession() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

function getFreshToken() {
  // If several requests fail at the same moment, they all share one refresh call
  if (!refreshing) {
    refreshing = (async () => {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) return null
      try {
        const res = await nativeFetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })
        if (!res.ok) return null
        const data = await res.json()
        if (!data.accessToken) return null
        localStorage.setItem('accessToken', data.accessToken)
        return data.accessToken
      } catch {
        return null
      }
    })()
    refreshing.finally(() => {
      refreshing = null
    })
  }
  return refreshing
}

window.fetch = async (input, init) => {
  const response = await nativeFetch(input, init)

  const url = typeof input === 'string' ? input : ''
  const sentToken = init?.headers && (init.headers.Authorization || init.headers.authorization)

  // Only handle our own API calls that were sent with a login token and got rejected
  if (response.status !== 401 || !url.startsWith('/api/') || url.startsWith('/api/auth/refresh') || !sentToken) {
    return response
  }

  const newToken = await getFreshToken()

  if (!newToken) {
    clearSession()
    if (PROTECTED_PREFIXES.some((p) => window.location.pathname.startsWith(p))) {
      window.location.assign('/login')
    }
    return response
  }

  return nativeFetch(input, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${newToken}` },
  })
}