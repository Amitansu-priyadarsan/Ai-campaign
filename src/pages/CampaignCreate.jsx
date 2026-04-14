import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, ChevronDown, ArrowRight, Monitor, Loader2 } from 'lucide-react'
import Star from '../assets/Star'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const serif = "'Noto Serif', serif"
const sans = 'Manrope, sans-serif'
const nimbus = "'Nimbus Sans', Manrope, sans-serif"

const MUSE_OPTIONS = [
  { id: 1, label: 'Muse 1', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=400&fit=crop', selected: true },
  { id: 2, label: 'Muse 2', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop' },
  { id: 3, label: 'Muse 3', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop' },
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
  const [uploadedImage, setUploadedImage] = useState(null)
  const [selectedMuse, setSelectedMuse] = useState(1)
  const [selectedDraping, setSelectedDraping] = useState('Kanjeevaram Silk (Crimson Gold)')
  const [selectedLocation, setSelectedLocation] = useState('Palace Courtyard')
  const [drapingPhysics, setDrapingPhysics] = useState(65)
  const [showDrapingDropdown, setShowDrapingDropdown] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)

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

  const handleGenerate = async () => {
    if (!uploadedImage) return
    setGenerating(true)
    setGenError(null)
    try {
      const base64Image = await fileToBase64(uploadedImage.file)
      const selectedMuseObj = MUSE_OPTIONS.find(m => m.id === selectedMuse)
      const payload = {
        jewelry_image: base64Image,
        muse_id: selectedMuse,
        muse_label: selectedMuseObj?.label || `Muse ${selectedMuse}`,
        draping: selectedDraping,
        location: selectedLocation,
        draping_physics: Number(drapingPhysics),
      }
      // Store config so the editor can call the backend and show shimmer while loading
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
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-8 h-[80px]"
        style={{ background: 'rgba(252,249,248,0.80)', borderBottom: '1px solid rgba(209,197,180,0.10)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: '#5F5E5E' }}>
            <ArrowLeft size={14} />
            <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 500 }}>Back to Dashboard</span>
          </button>
          <div style={{ width: 1, height: 24, background: 'rgba(209,197,180,0.30)' }} />
          <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, fontStyle: 'italic', color: '#775A19' }}>Atelier AI Studio</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#F6F3F2' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: '#775A19' }} />
            <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#5F5E5E' }}>Step 1: Configuration</span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-6 py-2.5 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: '#313030', color: '#F3F0EF' }}>
            <X size={12} />
            <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Exit Studio</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-8 pt-[128px] pb-12">
        {/* Title */}
        <div className="mb-12">
          <h1 style={{ fontFamily: serif, fontSize: 36, fontWeight: 400, color: '#1C1B1B', lineHeight: '40px' }}>Campaign Configuration</h1>
          <p className="mt-4 max-w-[672px]" style={{ fontFamily: sans, fontSize: 16, fontWeight: 400, color: '#5F5E5E', lineHeight: '24px' }}>
            Define the aesthetic foundations of your creative session. Upload your jewelry assets and select the environmental context for AI generation.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-0">
          {/* Left Column — Jewelry Asset */}
          <div className="pr-4">
            <div className="p-8 rounded-3xl" style={{ background: 'white', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
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
                className="flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-colors hover:bg-stone-100 overflow-hidden"
                style={{ background: '#F6F3F2', outline: '2px dashed rgba(209,197,180,0.40)', outlineOffset: -2, minHeight: 320 }}
              >
                {uploadedImage ? (
                  <img src={uploadedImage.url} alt="Uploaded jewelry" className="w-full h-[320px] object-contain" />
                ) : (
                  <div className="flex flex-col items-center p-6">
                    <Upload size={30} style={{ color: '#D1C5B4' }} />
                    <div className="mt-3" style={{ fontFamily: sans, fontSize: 16, fontWeight: 600, color: '#1C1B1B', textAlign: 'center' }}>Upload High-Res Jewelry</div>
                    <div className="mt-1" style={{ fontFamily: sans, fontSize: 12, fontWeight: 400, color: '#7F7667', textAlign: 'center' }}>PNG or TIFF with transparent background preferred</div>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>

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
          <div className="pl-4 flex flex-col gap-8">
            {/* Muse Selection */}
            <div className="p-8 rounded-3xl" style={{ background: 'white', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
              <div className="mb-6" style={{ fontFamily: serif, fontSize: 24, fontWeight: 400, color: '#1C1B1B', lineHeight: '32px' }}>2. Muse Selection</div>
              <div className="flex gap-4">
                {MUSE_OPTIONS.map(muse => (
                  <div key={muse.id} onClick={() => setSelectedMuse(muse.id)}
                    className="rounded-lg overflow-hidden cursor-pointer transition-all"
                    style={{ outline: selectedMuse === muse.id ? '2px solid #775A19' : '2px solid transparent', outlineOffset: -2 }}>
                    <div className="relative">
                      <img src={muse.image} alt={muse.label} className="w-[140px] h-[188px] object-cover" style={{ filter: selectedMuse === muse.id ? 'none' : 'saturate(0.3)' }} />
                      {selectedMuse === muse.id && <div className="absolute inset-0" style={{ background: 'rgba(119,90,25,0.10)' }} />}
                    </div>
                  </div>
                ))}
                {/* Custom Upload */}
                <div className="flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-stone-100"
                  style={{ width: 140, outline: '2px dashed rgba(209,197,180,0.30)', outlineOffset: -2 }}>
                  <div className="text-xl" style={{ color: '#D1C5B4' }}>+</div>
                  <div className="mt-1" style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: '#D1C5B4' }}>Custom</div>
                </div>
              </div>
            </div>

            {/* Attire & Environment */}
            <div className="p-8 rounded-3xl" style={{ background: 'white', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
              <div className="mb-6" style={{ fontFamily: serif, fontSize: 24, fontWeight: 400, color: '#1C1B1B', lineHeight: '32px' }}>3. Attire & Environment</div>

              <div className="grid grid-cols-2 gap-6">
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
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Draping Physics */}
                  <div className="p-4 rounded-lg" style={{ background: '#FCF9F8', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
                    <div className="mb-2" style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>Draping Physics</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative h-2 rounded-full" style={{ background: 'white' }}>
                        <input type="range" min="0" max="100" value={drapingPhysics} onChange={e => setDrapingPhysics(e.target.value)}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ height: '100%' }} />
                        <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${drapingPhysics}%`, background: '#775A19' }} />
                      </div>
                      <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: '#5F5E5E' }}>Traditional</span>
                    </div>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="sticky bottom-0 left-0 right-0 px-8 py-6" style={{ borderTop: '1px solid rgba(209,197,180,0.10)', background: '#FCF9F8' }}>
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div>
              <div className="mb-1" style={{ fontFamily: sans, fontSize: 9, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 1.8, color: '#7F7667' }}>Status</div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#775A19' }} />
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: '#1C1B1B' }}>Ready for Generation</span>
              </div>
            </div>
            <div>
              <div className="mb-1" style={{ fontFamily: sans, fontSize: 9, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 1.8, color: '#7F7667' }}>Output Resolution</div>
              <div className="flex items-center gap-2">
                <Monitor size={12} style={{ color: '#1C1B1B' }} />
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: '#1C1B1B' }}>8K Ultra Fidelity</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-8 py-4 cursor-pointer transition-opacity hover:opacity-70"
              style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5F5E5E' }}>
              Save Preset
            </button>
            {genError && (
              <span style={{ fontFamily: sans, fontSize: 12, color: '#dc2626' }}>{genError}</span>
            )}
            <button onClick={handleGenerate}
              disabled={!uploadedImage || generating}
              className="flex items-center gap-3 px-10 py-5 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(90deg, #775A19, #C5A059)',
                boxShadow: '0px 25px 50px -12px rgba(119,90,25,0.30)',
                opacity: (!uploadedImage || generating) ? 0.5 : 1,
                pointerEvents: generating ? 'none' : 'auto',
              }}>
              {generating ? (
                <>
                  <Loader2 size={15} className="animate-spin" style={{ color: 'white' }} />
                  <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.1, color: 'white' }}>Generating...</span>
                </>
              ) : (
                <>
                  <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.1, color: 'white' }}>Next: Creative Canvas</span>
                  <ArrowRight size={15} style={{ color: 'white' }} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
