import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, ChevronDown, ArrowRight, Monitor, Loader2, Plus, Trash2 } from 'lucide-react'
import Star from '../assets/Star'
import CustomAssetModal from '../components/CustomAssetModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const serif = "'Noto Serif', serif"
const sans = 'Manrope, sans-serif'
const nimbus = "'Nimbus Sans', Manrope, sans-serif"

// Muse = subject type. Each value drives a different prompt set on the backend.
const MUSE_OPTIONS = [
  { type: 'indian_model', label: 'Indian Model', desc: 'Full beauty shot', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop', objectPosition: 'center 30%' },
  { type: 'jewelry_only', label: 'Jewelry Only', desc: 'Pure product, no model', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=400&fit=crop' },
  { type: 'hand', label: 'Hand', desc: 'Rings & bracelets', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=400&fit=crop' },
  { type: 'neck', label: 'Neck', desc: 'Necklaces & earrings', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=400&fit=crop' },
]

const DRAPING_OPTIONS = [
  'Kanjeevaram Silk (Crimson Gold)',
  'Banarasi Brocade (Royal Purple)',
  'Chanderi Silk (Ivory)',
  'Paithani (Peacock Green)',
]

const LOCATION_OPTIONS = ['Heirloom Setting', 'Palace Courtyard', 'Studio Minimal', 'Moonlit Terrace']

export default function CampaignCreate({ brand }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [selectedMuse, setSelectedMuse] = useState('indian_model')
  const [selectedCustomMuseId, setSelectedCustomMuseId] = useState(null)
  const [selectedDraping, setSelectedDraping] = useState('Kanjeevaram Silk (Crimson Gold)')
  const [selectedLocation, setSelectedLocation] = useState('Palace Courtyard')
  const [drapingPhysicsEnabled, setDrapingPhysicsEnabled] = useState(false)
  const [drapingPhysics, setDrapingPhysics] = useState(65)
  const [showDrapingDropdown, setShowDrapingDropdown] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)

  // Custom assets fetched from backend
  const [customMuses, setCustomMuses] = useState([])
  const [customDrapings, setCustomDrapings] = useState([])
  const [customLocations, setCustomLocations] = useState([])
  const [modal, setModal] = useState(null) // 'muses' | 'drapings' | 'locations' | null

  const getToken = () => {
    try {
      const raw = localStorage.getItem('ai-campaign-user')
      return raw ? JSON.parse(raw)?.access_token : null
    } catch { return null }
  }

  const fetchCustom = async (kind, setter) => {
    const token = getToken()
    if (!token) return
    try {
      const r = await fetch(`${API_URL}/custom/${kind}`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await r.json()
      if (data?.success) setter(data.items || [])
    } catch {}
  }

  useEffect(() => {
    fetchCustom('muses', setCustomMuses)
    fetchCustom('drapings', setCustomDrapings)
    fetchCustom('locations', setCustomLocations)
  }, [])

  const saveCustom = async (kind, payload) => {
    const token = getToken()
    if (!token) throw new Error('Not signed in.')
    const r = await fetch(`${API_URL}/custom/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    const data = await r.json()
    if (!r.ok || !data?.success) throw new Error(data?.detail || 'Save failed.')
    if (kind === 'muses') setCustomMuses(prev => [data.item, ...prev])
    else if (kind === 'drapings') setCustomDrapings(prev => [data.item, ...prev])
    else if (kind === 'locations') setCustomLocations(prev => [data.item, ...prev])
  }

  const deleteCustom = async (kind, id) => {
    const token = getToken()
    if (!token) return
    await fetch(`${API_URL}/custom/${kind}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (kind === 'muses') {
      setCustomMuses(prev => prev.filter(m => m.id !== id))
      if (selectedCustomMuseId === id) { setSelectedCustomMuseId(null); setSelectedMuse('indian_model') }
    } else if (kind === 'drapings') {
      setCustomDrapings(prev => prev.filter(m => m.id !== id))
    } else if (kind === 'locations') {
      setCustomLocations(prev => prev.filter(m => m.id !== id))
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedImage({ file, url })
    }
  }

  const clearUpload = () => setUploadedImage(null)

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const dataUrlToBase64 = (dataUrl) => (dataUrl || '').split(',')[1] || null

  const handleGenerate = async () => {
    if (!uploadedImage) return
    if (selectedMuse === 'custom' && !selectedCustomMuseId) {
      setGenError('Please pick a saved custom muse or choose a built-in one.')
      return
    }
    setGenerating(true)
    setGenError(null)
    try {
      const base64Image = await fileToBase64(uploadedImage.file)
      const selectedMuseObj = MUSE_OPTIONS.find(m => m.type === selectedMuse)
      let customMuseB64 = null
      let customLabel = null
      if (selectedMuse === 'custom' && selectedCustomMuseId) {
        const cm = customMuses.find(m => m.id === selectedCustomMuseId)
        customMuseB64 = dataUrlToBase64(cm?.image)
        customLabel = cm?.label || 'Custom Muse'
      }
      const payload = {
        jewelry_image: base64Image,
        muse_type: selectedMuse,
        muse_label: selectedMuse === 'custom' ? (customLabel || 'Custom Muse') : (selectedMuseObj?.label || 'Indian Model'),
        custom_muse_image: customMuseB64,
        draping: selectedDraping,
        location: selectedLocation,
        draping_physics: drapingPhysicsEnabled ? Number(drapingPhysics) : 50,
      }
      sessionStorage.setItem('campaign-config', JSON.stringify(payload))
      navigate('/campaign/editor')
    } catch (err) {
      setGenError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#FCF9F8' }}>
      {/* Top Nav Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3 sm:h-[80px] gap-3 sm:gap-0"
        style={{ background: 'rgba(252,249,248,0.80)', borderBottom: '1px solid rgba(209,197,180,0.10)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2 sm:gap-6">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: '#5F5E5E' }}>
            <ArrowLeft size={14} />
            <span className="hidden sm:inline" style={{ fontFamily: sans, fontSize: 14, fontWeight: 500 }}>Back to Dashboard</span>
          </button>
          <div className="hidden sm:block" style={{ width: 1, height: 24, background: 'rgba(209,197,180,0.30)' }} />
          <span style={{ fontFamily: serif, fontSize: 16, fontWeight: 400, fontStyle: 'italic', color: '#775A19' }}>Atelier AI Studio</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 w-full sm:w-auto">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#F6F3F2' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: '#775A19' }} />
            <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#5F5E5E' }}>Step 1: Configuration</span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl cursor-pointer transition-opacity hover:opacity-90 w-full sm:w-auto"
            style={{ background: '#313030', color: '#F3F0EF' }}>
            <X size={12} />
            <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Exit Studio</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-[100px] sm:pt-[128px] pb-8 sm:pb-12">
        {/* Title */}
        <div className="mb-8 sm:mb-12">
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 400, color: '#1C1B1B', lineHeight: '1.2' }}>Campaign Configuration</h1>
          <p className="mt-2 sm:mt-4 max-w-[672px]" style={{ fontFamily: sans, fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 400, color: '#5F5E5E', lineHeight: '1.5' }}>
            Define the aesthetic foundations of your creative session. Upload your jewelry assets and select the environmental context for AI generation.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Column — Jewelry Asset */}
          <div className="lg:pr-4 flex">
            <div className="p-4 sm:p-8 rounded-3xl flex flex-col w-full" style={{ background: 'white', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 400, color: '#1C1B1B', lineHeight: '32px' }}>1. Jewelry Asset</div>
                {uploadedImage && (
                  <button onClick={clearUpload} className="cursor-pointer" style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19' }}>Clear</button>
                )}
              </div>

              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-colors hover:bg-stone-100 overflow-hidden flex-1"
                style={{ background: '#F6F3F2', outline: '2px dashed rgba(209,197,180,0.40)', outlineOffset: -2, minHeight: 'clamp(240px, 50vh, 320px)' }}
              >
                {uploadedImage ? (
                  <img src={uploadedImage.url} alt="Uploaded jewelry" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center p-4 sm:p-6">
                    <Upload size={30} style={{ color: '#D1C5B4' }} />
                    <div className="mt-3" style={{ fontFamily: sans, fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 600, color: '#1C1B1B', textAlign: 'center' }}>Upload High-Res Jewelry</div>
                    <div className="mt-1" style={{ fontFamily: sans, fontSize: 12, fontWeight: 400, color: '#7F7667', textAlign: 'center' }}>PNG or TIFF with transparent background preferred</div>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>

              {/* Mobile Camera & Upload Buttons */}
              <div className="sm:hidden flex gap-3 mt-4 w-full">
                <button onClick={() => cameraInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg cursor-pointer transition-colors"
                  style={{ background: 'rgba(119,90,25,0.08)', color: '#775A19', fontFamily: sans, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 7l-5 5m0 0l-5-5m5 5v12m6-17h4a2 2 0 012 2v12a2 2 0 01-2 2h-4M9 2H5a2 2 0 00-2 2v12a2 2 0 002 2h4" /></svg>
                  Camera
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg cursor-pointer transition-colors"
                  style={{ background: 'rgba(119,90,25,0.08)', color: '#775A19', fontFamily: sans, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  <Upload size={14} />
                  Upload
                </button>
              </div>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />

              {/* Analyze Button */}
              <button className="w-full flex items-center justify-center gap-2 py-4 rounded-lg mt-6 cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: '#E5E2E1' }}>
                <Monitor size={13} style={{ color: '#4E4639' }} />
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: '#4E4639' }}>Analyze Visual DNA</span>
              </button>

              {/* AI Insights */}
              <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(119,90,25,0.05)', outline: '1px solid rgba(119,90,25,0.10)', outlineOffset: -1 }}>
                <div className="flex items-center gap-2 mb-3">
                  <Star />
                  <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19' }}>AI Insights</span>
                </div>
                <p style={{ fontFamily: sans, fontSize: 14, fontWeight: 400, color: '#5F5E5E', lineHeight: '22.75px' }}>
                  "Select an asset to unlock deep-learning insights on craftsmanship, heritage style, and high-conversion aesthetic pairings."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column — Muse Selection + Attire & Environment */}
          <div className="lg:pl-4 flex flex-col gap-6 sm:gap-8 mt-6 lg:mt-0">
            {/* Muse Selection */}
            <div className="p-4 sm:p-8 rounded-3xl" style={{ background: 'white', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
              <div className="mb-2" style={{ fontFamily: serif, fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 400, color: '#1C1B1B', lineHeight: '1.2' }}>2. Muse Selection</div>
              <div className="mb-4 sm:mb-6" style={{ fontFamily: sans, fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: 400, color: '#7F7667' }}>
                Choose the subject of the shot. The 4 angle variations (front, three-quarter, close-up, profile) are generated automatically.
              </div>
              <div className="grid gap-3 sm:gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                {MUSE_OPTIONS.map(muse => {
                  const active = selectedMuse === muse.type
                  return (
                    <div key={muse.type} onClick={() => { setSelectedMuse(muse.type); setSelectedCustomMuseId(null) }}
                      className="rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'white',
                        boxShadow: active
                          ? '0 0 0 2px #775A19, 0 12px 24px -12px rgba(119,90,25,0.40)'
                          : '0 0 0 1px rgba(209,197,180,0.40), 0 2px 6px -2px rgba(28,27,27,0.06)',
                      }}>
                      <div className="relative" style={{ aspectRatio: '4 / 5' }}>
                        <img src={muse.image} alt={muse.label} className="absolute inset-0 w-full h-full object-cover transition-all duration-200"
                          style={{ filter: active ? 'none' : 'saturate(0.5)', objectPosition: muse.objectPosition || 'center' }} />
                        {active && <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(119,90,25,0.18), transparent 50%)' }} />}
                      </div>
                      <div className="px-3 py-2.5" style={{ background: active ? 'linear-gradient(to bottom, rgba(119,90,25,0.06), white)' : 'white' }}>
                        <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: active ? '#775A19' : '#1C1B1B', textAlign: 'center', letterSpacing: 0.1 }}>{muse.label}</div>
                        <div className="mt-0.5" style={{ fontFamily: sans, fontSize: 10, fontWeight: 400, color: '#7F7667', textAlign: 'center', lineHeight: '14px' }}>{muse.desc}</div>
                      </div>
                    </div>
                  )
                })}
                {/* User-saved custom muses */}
                {customMuses.map(cm => {
                  const active = selectedMuse === 'custom' && selectedCustomMuseId === cm.id
                  return (
                    <div key={cm.id} onClick={() => { setSelectedMuse('custom'); setSelectedCustomMuseId(cm.id) }}
                      className="rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-200 hover:-translate-y-0.5 relative group"
                      style={{
                        background: 'white',
                        boxShadow: active
                          ? '0 0 0 2px #775A19, 0 12px 24px -12px rgba(119,90,25,0.40)'
                          : '0 0 0 1px rgba(209,197,180,0.40), 0 2px 6px -2px rgba(28,27,27,0.06)',
                      }}>
                      <div className="relative" style={{ aspectRatio: '4 / 5', background: '#F6F3F2' }}>
                        {cm.image ? <img src={cm.image} alt={cm.label} className="absolute inset-0 w-full h-full object-cover transition-all duration-200" style={{ filter: active ? 'none' : 'saturate(0.6)' }} />
                          : <div className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: sans, fontSize: 11, color: '#A89A85' }}>No image</div>}
                        {active && <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(119,90,25,0.18), transparent 50%)' }} />}
                        <button onClick={(e) => { e.stopPropagation(); deleteCustom('muses', cm.id) }}
                          className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: 'rgba(28,27,27,0.75)', backdropFilter: 'blur(6px)' }}>
                          <Trash2 size={11} style={{ color: 'white' }} />
                        </button>
                      </div>
                      <div className="px-3 py-2.5" style={{ background: active ? 'linear-gradient(to bottom, rgba(119,90,25,0.06), white)' : 'white' }}>
                        <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: active ? '#775A19' : '#1C1B1B', textAlign: 'center', letterSpacing: 0.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cm.label}</div>
                        <div className="mt-0.5" style={{ fontFamily: sans, fontSize: 10, fontWeight: 400, color: '#7F7667', textAlign: 'center' }}>Custom</div>
                      </div>
                    </div>
                  )
                })}
                {/* + Add Custom Muse */}
                <div onClick={() => setModal('muses')}
                  className="rounded-2xl cursor-pointer flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'transparent',
                    boxShadow: 'inset 0 0 0 2px rgba(209,197,180,0.50)',
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(209,197,180,0.05) 6px, rgba(209,197,180,0.05) 12px)',
                  }}>
                  <div className="flex flex-col items-center justify-center" style={{ aspectRatio: '4 / 5' }}>
                    <div className="rounded-full flex items-center justify-center" style={{ width: 44, height: 44, background: 'rgba(119,90,25,0.08)', border: '1px solid rgba(119,90,25,0.20)' }}>
                      <Plus size={20} style={{ color: '#775A19' }} />
                    </div>
                  </div>
                  <div className="px-3 py-2.5">
                    <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: '#775A19', textAlign: 'center', letterSpacing: 0.1 }}>Add Custom</div>
                    <div className="mt-0.5" style={{ fontFamily: sans, fontSize: 10, fontWeight: 400, color: '#7F7667', textAlign: 'center' }}>Save your own muse</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attire & Environment */}
            <div className="p-4 sm:p-8 rounded-3xl" style={{ background: 'white', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
              <div className="mb-4 sm:mb-6" style={{ fontFamily: serif, fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 400, color: '#1C1B1B', lineHeight: '1.2' }}>3. Attire & Environment</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Left: Draping */}
                <div className="flex flex-col gap-4">
                  {/* Heritage Draping */}
                  <div>
                    <div className="mb-2" style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>Heritage Draping</div>
                    <div className="relative">
                      <button onClick={() => setShowDrapingDropdown(!showDrapingDropdown)}
                        className="w-full flex items-center justify-between px-5 py-4 rounded-lg cursor-pointer text-left"
                        style={{ background: '#F0EDED' }}>
                        <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 400, color: '#1C1B1B' }}>{selectedDraping}</span>
                        <ChevronDown size={18} style={{ color: '#6B7280' }} />
                      </button>
                      {showDrapingDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-10" style={{ background: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                          {DRAPING_OPTIONS.map(opt => (
                            <button key={opt} onClick={() => { setSelectedDraping(opt); setShowDrapingDropdown(false) }}
                              className="w-full text-left px-5 py-3 cursor-pointer hover:bg-stone-50 transition-colors"
                              style={{ fontFamily: sans, fontSize: 13, color: selectedDraping === opt ? '#775A19' : '#1C1B1B', fontWeight: selectedDraping === opt ? 600 : 400 }}>
                              {opt}
                            </button>
                          ))}
                          {customDrapings.map(cd => (
                            <div key={cd.id} className="flex items-center justify-between hover:bg-stone-50 transition-colors"
                              style={{ borderTop: customDrapings[0]?.id === cd.id ? '1px solid rgba(209,197,180,0.30)' : 'none' }}>
                              <button onClick={() => { setSelectedDraping(cd.label); setShowDrapingDropdown(false) }}
                                className="flex-1 text-left px-5 py-3 cursor-pointer"
                                style={{ fontFamily: sans, fontSize: 13, color: selectedDraping === cd.label ? '#775A19' : '#1C1B1B', fontWeight: selectedDraping === cd.label ? 600 : 400 }}>
                                {cd.label}
                              </button>
                              <button onClick={() => deleteCustom('drapings', cd.id)} className="px-3 cursor-pointer" style={{ color: '#A89A85' }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                          <button onClick={() => { setShowDrapingDropdown(false); setModal('drapings') }}
                            className="w-full text-left px-5 py-3 cursor-pointer hover:bg-stone-50 transition-colors flex items-center gap-2"
                            style={{ fontFamily: sans, fontSize: 13, color: '#775A19', fontWeight: 600, borderTop: '1px solid rgba(209,197,180,0.30)' }}>
                            <Plus size={14} /> Add Custom Draping
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Draping Physics — optional */}
                  <div className="p-4 rounded-lg" style={{ background: '#FCF9F8', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input type="checkbox" checked={drapingPhysicsEnabled} onChange={e => setDrapingPhysicsEnabled(e.target.checked)}
                        style={{ accentColor: '#775A19' }} />
                      <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>
                        Draping Physics (optional)
                      </span>
                    </label>
                    {drapingPhysicsEnabled && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative h-2 rounded-full" style={{ background: 'white' }}>
                          <input type="range" min="0" max="100" value={drapingPhysics} onChange={e => setDrapingPhysics(e.target.value)}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ height: '100%' }} />
                          <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${drapingPhysics}%`, background: '#775A19' }} />
                        </div>
                        <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: '#5F5E5E' }}>{drapingPhysics > 50 ? 'Traditional' : 'Modern'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Location */}
                <div>
                  <div className="mb-2" style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>Location Context</div>
                  <div className="flex flex-wrap gap-3">
                    {LOCATION_OPTIONS.map(loc => (
                      <button key={loc} onClick={() => setSelectedLocation(loc)}
                        className="px-4 py-3 rounded-lg cursor-pointer transition-all"
                        style={{
                          background: selectedLocation === loc ? '#775A19' : '#F0EDED',
                          color: selectedLocation === loc ? 'white' : '#4E4639',
                          fontFamily: sans, fontSize: 12, fontWeight: 600,
                          boxShadow: selectedLocation === loc ? '0px 4px 6px -4px rgba(119,90,25,0.20), 0px 10px 15px -3px rgba(119,90,25,0.20)' : 'none',
                        }}>
                        {loc}
                      </button>
                    ))}
                    {customLocations.map(cl => {
                      const active = selectedLocation === cl.label
                      return (
                        <div key={cl.id} className="relative group">
                          <button onClick={() => setSelectedLocation(cl.label)}
                            className="px-4 py-3 rounded-lg cursor-pointer transition-all pr-7"
                            style={{
                              background: active ? '#775A19' : '#F0EDED',
                              color: active ? 'white' : '#4E4639',
                              fontFamily: sans, fontSize: 12, fontWeight: 600,
                              boxShadow: active ? '0px 4px 6px -4px rgba(119,90,25,0.20), 0px 10px 15px -3px rgba(119,90,25,0.20)' : 'none',
                            }}>
                            {cl.label}
                          </button>
                          <button onClick={() => deleteCustom('locations', cl.id)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 cursor-pointer opacity-0 group-hover:opacity-100"
                            style={{ color: active ? 'white' : '#A89A85' }}>
                            <X size={11} />
                          </button>
                        </div>
                      )
                    })}
                    <button onClick={() => setModal('locations')}
                      className="px-4 py-3 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                      style={{ background: 'transparent', outline: '2px dashed rgba(209,197,180,0.40)', outlineOffset: -2, color: '#775A19', fontFamily: sans, fontSize: 12, fontWeight: 600 }}>
                      <Plus size={12} /> Add Custom
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="sticky bottom-0 left-0 right-0 px-4 sm:px-8 py-4 sm:py-6" style={{ borderTop: '1px solid rgba(209,197,180,0.10)', background: '#FCF9F8' }}>
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-col gap-4 sm:gap-10 w-full sm:w-auto">
            <div>
              <div className="mb-1" style={{ fontFamily: sans, fontSize: 9, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 1.8, color: '#7F7667' }}>Status</div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#775A19' }} />
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: '#1C1B1B' }}>Ready for Generation</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="mb-1" style={{ fontFamily: sans, fontSize: 9, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 1.8, color: '#7F7667' }}>Output Resolution</div>
              <div className="flex items-center gap-2">
                <Monitor size={12} style={{ color: '#1C1B1B' }} />
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: '#1C1B1B' }}>8K Ultra Fidelity</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button className="hidden sm:block px-6 sm:px-8 py-3 sm:py-4 cursor-pointer transition-opacity hover:opacity-70"
              style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5F5E5E' }}>
              Save Preset
            </button>
            {genError && (
              <span style={{ fontFamily: sans, fontSize: 12, color: '#dc2626' }}>{genError}</span>
            )}
            <button onClick={handleGenerate}
              disabled={!uploadedImage || generating}
              className="flex items-center justify-center gap-2 px-6 py-3 sm:px-10 sm:py-5 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(90deg, #775A19, #C5A059)',
                boxShadow: '0px 25px 50px -12px rgba(119,90,25,0.30)',
                opacity: (!uploadedImage || generating) ? 0.5 : 1,
                pointerEvents: generating ? 'none' : 'auto',
              }}>
              {generating ? (
                <>
                  <Loader2 size={15} className="animate-spin" style={{ color: 'white' }} />
                  <span style={{ fontFamily: sans, fontSize: 'clamp(11px, 2.5vw, 14px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'white' }}>Generating...</span>
                </>
              ) : (
                <>
                  <span style={{ fontFamily: sans, fontSize: 'clamp(11px, 2.5vw, 14px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'white' }}>Next: Creative Canvas</span>
                  <ArrowRight size={15} style={{ color: 'white' }} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <CustomAssetModal
        open={!!modal}
        title={
          modal === 'muses' ? 'Add Custom Muse' :
          modal === 'drapings' ? 'Add Custom Draping' :
          modal === 'locations' ? 'Add Custom Location' : ''
        }
        showImage={modal === 'muses'}
        imageRequired={modal === 'muses'}
        onClose={() => setModal(null)}
        onSave={async ({ label, image }) => {
          await saveCustom(modal, { label, image })
        }}
      />
    </div>
  )
}
