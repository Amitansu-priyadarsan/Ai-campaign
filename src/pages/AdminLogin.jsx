import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Login failed')
        return
      }
      onLogin({ ...data.admin, admin_secret: data.admin_secret })
    } catch {
      setError('Unable to reach server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0E0E] flex flex-col items-center justify-center p-4 font-sans">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#775A19] to-[#C5A059] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L13.5 8.5H17L12 12.5L14 18L10 14.5L6 18L8 12.5L3 8.5H6.5L10 2Z" fill="white" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-semibold text-[#775A19] uppercase tracking-[3px]">
            L'Atelier AI
          </p>
          <h1 className="text-2xl font-serif italic text-white mt-1">Admin Console</h1>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-[400px] bg-[#1A1918] border border-white/5 rounded-xl p-10 shadow-2xl">
        <h2 className="text-lg font-serif text-white mb-1">Sign In</h2>
        <p className="text-[11px] text-[#6B6560] uppercase tracking-[1.5px] mb-8">Restricted Access</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-[1.2px]">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="superadmin@latelier.com"
              className="w-full px-4 py-3 bg-[#0F0E0E] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-[#775A19] transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-[1.2px]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#0F0E0E] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-[#775A19] transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-[12px] font-bold uppercase tracking-[2px] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99]"
            style={{ background: 'linear-gradient(90deg, #775A19 0%, #C5A059 100%)' }}
          >
            {loading ? 'Authenticating...' : 'Access Console'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-[10px] text-[#3A3836] uppercase tracking-[2px]">
        Restricted · Authorized Personnel Only
      </p>
    </div>
  )
}
