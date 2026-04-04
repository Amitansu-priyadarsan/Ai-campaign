import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import CampaignCreate from './pages/CampaignCreate'
import CampaignEditor from './pages/CampaignEditor'
import AiChat from './pages/AiChat'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ai-campaign-user')
    return saved ? JSON.parse(saved) : null
  })

  const [brandConfig, setBrandConfig] = useState(() => {
    const saved = localStorage.getItem('ai-campaign-brand')
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

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={login} /> : <Navigate to={brandConfig ? "/dashboard" : "/onboarding"} />} />
        <Route path="/signup" element={!user ? <Signup onSignup={login} /> : <Navigate to="/onboarding" />} />
        <Route path="/onboarding" element={user ? <Onboarding onSave={saveBrand} /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} brand={brandConfig} onLogout={logout} /> : <Navigate to="/login" />} />
        <Route path="/campaign/create" element={user ? <CampaignCreate brand={brandConfig} /> : <Navigate to="/login" />} />
        <Route path="/campaign/editor" element={user ? <CampaignEditor brand={brandConfig} /> : <Navigate to="/login" />} />
        <Route path="/chat" element={<AiChat />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
