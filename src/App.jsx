import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import CampaignCreate from './pages/CampaignCreate'
import CampaignEditor from './pages/CampaignEditor'
import AiChat from './pages/AiChat'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ai-campaign-user')
    return saved ? JSON.parse(saved) : null
  })

  const [brandConfig, setBrandConfig] = useState(() => {
    const saved = localStorage.getItem('ai-campaign-brand')
    return saved ? JSON.parse(saved) : null
  })

  const [admin, setAdmin] = useState(() => {
    const saved = sessionStorage.getItem('ai-campaign-admin')
    return saved ? JSON.parse(saved) : null
  })

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('ai-campaign-user', JSON.stringify(userData))
  }

  const saveBrand = (config) => {
    setBrandConfig(config)
    localStorage.setItem('ai-campaign-brand', JSON.stringify(config))
  }

  const logout = () => {
    setUser(null)
    setBrandConfig(null)
    localStorage.removeItem('ai-campaign-user')
    localStorage.removeItem('ai-campaign-brand')
  }

  const adminLogin = (adminData) => {
    setAdmin(adminData)
    sessionStorage.setItem('ai-campaign-admin', JSON.stringify(adminData))
  }

  const adminLogout = () => {
    setAdmin(null)
    sessionStorage.removeItem('ai-campaign-admin')
  }

  return (
    <Router>
      <Routes>
        {/* ── User routes ── */}
        <Route path="/login" element={!user ? <Login onLogin={login} /> : <Navigate to={brandConfig ? "/dashboard" : "/onboarding"} />} />
        <Route path="/signup" element={!user ? <Signup onSignup={login} /> : <Navigate to="/onboarding" />} />
        <Route path="/onboarding" element={user ? <Onboarding onSave={saveBrand} user={user} /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} brand={brandConfig} onLogout={logout} /> : <Navigate to="/login" />} />
        <Route path="/campaign/create" element={user ? <CampaignCreate brand={brandConfig} /> : <Navigate to="/login" />} />
        <Route path="/campaign/editor" element={user ? <CampaignEditor brand={brandConfig} /> : <Navigate to="/login" />} />
        <Route path="/chat" element={<AiChat />} />

        {/* ── Admin routes ── */}
        <Route path="/admin/login" element={!admin ? <AdminLogin onLogin={adminLogin} /> : <Navigate to="/admin" />} />
        <Route path="/admin" element={admin ? <AdminPanel admin={admin} onLogout={adminLogout} /> : <Navigate to="/admin/login" />} />

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
