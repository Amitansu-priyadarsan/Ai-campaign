import { useState, useEffect, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1.75 3.5h10.5M5.25 3.5V2.333a.583.583 0 01.584-.583h2.333a.583.583 0 01.583.583V3.5M11.083 3.5l-.583 8.167A1.167 1.167 0 019.333 12.75H4.667A1.167 1.167 0 013.5 11.667L2.917 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 14H3.333A1.333 1.333 0 012 12.667V3.333A1.333 1.333 0 013.333 2H6M10.667 11.333L14 8l-3.333-3.333M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function AdminPanel({ admin, onLogout }) {
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '', company: '' })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const authHeaders = {
    'Content-Type': 'application/json',
    'x-admin-secret': admin.admin_secret,
  }

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    setFetchError('')
    try {
      const res = await fetch(`${API_URL}/admin/users`, { headers: authHeaders })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to fetch users')
      setUsers(data.users)
    } catch (e) {
      setFetchError(e.message)
    } finally {
      setLoadingUsers(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleAddUser = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create user')
      setShowModal(false)
      setForm({ email: '', password: '', name: '', company: '' })
      fetchUsers()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    setDeleteId(userId)
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.detail || 'Failed to delete user')
        return
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch {
      alert('Unable to reach server.')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0E0E] font-sans text-white">
      {/* Top Nav */}
      <header className="border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#775A19] to-[#C5A059] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L13.5 8.5H17L12 12.5L14 18L10 14.5L6 18L8 12.5L3 8.5H6.5L10 2Z" fill="white" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#775A19] uppercase tracking-[2px]">L'Atelier AI</span>
            <p className="text-xs text-white/40 leading-none mt-0.5">Admin Console</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-white">{admin.email}</p>
            <p className="text-[10px] text-[#775A19] uppercase tracking-[1px]">Superadmin</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-[#6B6560] hover:text-white hover:border-white/20 transition-all text-xs"
          >
            <LogOutIcon />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-8 py-10">
        {/* Page Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif text-white">User Management</h2>
            <p className="text-sm text-[#6B6560] mt-1">
              Add and manage B2B client accounts. Users log in via the main portal.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-[1.5px] text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'linear-gradient(90deg, #775A19 0%, #C5A059 100%)' }}
          >
            <PlusIcon />
            Add User
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Users', value: users.length },
            { label: 'Confirmed', value: users.filter(u => u.confirmed).length },
            { label: 'Pending', value: users.filter(u => !u.confirmed).length },
          ].map(stat => (
            <div key={stat.label} className="bg-[#1A1918] border border-white/5 rounded-xl px-6 py-5">
              <p className="text-2xl font-serif text-white">{stat.value}</p>
              <p className="text-[11px] text-[#6B6560] uppercase tracking-[1.2px] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#1A1918] border border-white/5 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-white/5">
            {['Name / Email', 'Company', 'Added', 'Status'].map(h => (
              <span key={h} className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-[1.2px]">{h}</span>
            ))}
          </div>

          {loadingUsers ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 rounded-full border-2 border-[#775A19] border-t-transparent animate-spin" />
            </div>
          ) : fetchError ? (
            <div className="py-16 text-center">
              <p className="text-sm text-red-400">{fetchError}</p>
              <button onClick={fetchUsers} className="mt-3 text-[11px] text-[#C5A059] uppercase tracking-[1px] hover:opacity-70">
                Retry
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-[#6B6560]">No users yet. Add your first B2B client above.</p>
            </div>
          ) : (
            users.map((user, idx) => (
              <div
                key={user.id}
                className={`grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors ${idx !== users.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                {/* Name / Email */}
                <div>
                  <p className="text-sm font-medium text-white">{user.name || '—'}</p>
                  <p className="text-[11px] text-[#6B6560] mt-0.5">{user.email}</p>
                </div>
                {/* Company */}
                <p className="text-sm text-[#9B8E7E]">{user.company || '—'}</p>
                {/* Date */}
                <p className="text-[11px] text-[#6B6560]">{formatDate(user.created_at)}</p>
                {/* Status + Delete */}
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-semibold uppercase tracking-[1px] px-2.5 py-1 rounded-full ${user.confirmed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {user.confirmed ? 'Active' : 'Pending'}
                  </span>
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={deleteId === user.id}
                    className="p-1.5 rounded-lg text-[#6B6560] hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                    title="Delete user"
                  >
                    {deleteId === user.id
                      ? <div className="w-3.5 h-3.5 rounded-full border border-current border-t-transparent animate-spin" />
                      : <TrashIcon />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-[460px] bg-[#1A1918] border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-serif text-white mb-1">Add New User</h3>
            <p className="text-[11px] text-[#6B6560] uppercase tracking-[1.2px] mb-7">
              Create a B2B client account in Supabase
            </p>

            <form onSubmit={handleAddUser} className="flex flex-col gap-5">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. Priya Sharma' },
                { label: 'Company', key: 'company', type: 'text', placeholder: 'e.g. Maison de Bijoux' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'user@company.com' },
                { label: 'Temporary Password', key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(field => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-[1.2px]">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-[#0F0E0E] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-[#775A19] transition-colors"
                    required
                  />
                </div>
              ))}

              {formError && (
                <p className="text-[12px] text-red-400 text-center">{formError}</p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormError('') }}
                  className="flex-1 py-3 rounded-lg border border-white/10 text-[12px] font-semibold text-[#6B6560] hover:text-white hover:border-white/20 transition-all uppercase tracking-[1.2px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 rounded-lg text-[12px] font-bold uppercase tracking-[1.5px] text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(90deg, #775A19 0%, #C5A059 100%)' }}
                >
                  {formLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
