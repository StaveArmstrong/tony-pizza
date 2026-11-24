import { Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import logo from '../assets/logo.png'

function DashboardHeader() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
    } catch {
      // clear local session regardless
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <header className="bg-neutral-900 px-8 py-4 flex items-center justify-between">
      <Link to="/">
        <img src={logo} alt="Tony's Pizza" className="h-12 w-auto" style={{ mixBlendMode: 'screen' }} />
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors text-sm font-medium"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </button>
    </header>
  )
}

export default DashboardHeader