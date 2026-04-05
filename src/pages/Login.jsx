import { useState } from 'react'
import { Link } from 'react-router-dom'
import Diamond from '../assets/Diamond'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Login failed')
        return
      }
      onLogin(data.user)
    } catch {
      setError('Unable to reach server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col items-center justify-center p-4 font-sans selection:bg-primary/20">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="p-3 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-xl flex items-center justify-center transition-transform hover:scale-110 duration-500">
          <Diamond />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-serif italic text-text-dark leading-none tracking-tight">
            L'Atelier AI
          </h1>
          <p className="text-[10px] font-medium text-secondary uppercase tracking-[2px]">
            The Digital Jewelry Studio
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[448px] bg-white rounded flex flex-col p-12 shadow-[0_20px_50px_rgba(28,27,27,0.05)] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-text-dark mb-2 leading-8">Sign In</h2>
          <div className="w-8 h-0.5 bg-linear-to-r from-primary to-primary-light" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-12">
          {/* Email Field */}
          <div className="flex flex-col gap-2 group">
            <label className="text-[10px] font-semibold text-secondary uppercase tracking-[1px] group-focus-within:text-primary transition-colors">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@atelier.com"
              className="w-full py-3.5 bg-transparent border-b border-border-beige/30 outline-none text-base text-text-dark placeholder:text-text-muted/50 focus:border-primary transition-all"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2 group">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold text-secondary uppercase tracking-[1px] group-focus-within:text-primary transition-colors">
                Password
              </label>
              <button type="button" className="text-[10px] text-primary uppercase tracking-[1px] hover:opacity-70 transition-opacity">
                Forgot?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full py-3.5 bg-transparent border-b border-border-beige/30 outline-none text-base text-text-dark placeholder:text-text-muted/50 focus:border-primary transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-500 text-center -mt-6">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-primary to-primary-light py-4 rounded text-white text-[14px] font-bold uppercase tracking-[2.8px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Membership Footer */}
        <div className="mt-12 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border-beige/20" />
            <span className="text-[10px] text-secondary uppercase tracking-[1px]">Membership</span>
            <div className="h-px flex-1 bg-border-beige/20" />
          </div>

          <div className="flex justify-center items-center gap-1.5 text-sm">
            <span className="text-secondary">New to the atelier?</span>
            <Link to="/signup" className="text-primary font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity">
              Request Access
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <footer className="mt-12 opacity-40 hover:opacity-100 transition-opacity duration-500">
        <p className="text-[9px] text-text-muted uppercase tracking-[2.7px] text-center">
          © 2024 L'Atelier AI — Proprietary Intelligence
        </p>
      </footer>
    </div>
  )
}
