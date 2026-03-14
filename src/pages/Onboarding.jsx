import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Palette, Building2, Share2, ChevronRight, Check, Sparkles, Instagram, Facebook, MessageCircle, Mail, MessageSquare } from 'lucide-react'

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
  { id: 'email', name: 'Email', icon: Mail, color: '#6366f1' },
  { id: 'sms', name: 'SMS', icon: MessageSquare, color: '#8B5CF6' },
]

const PRESET_COLORS = [
  '#4f46e5', '#7c3aed', '#ec4899', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#1e1b4b'
]

const steps = [
  { id: 1, title: 'Business Info', icon: Building2 },
  { id: 2, title: 'Brand Colors', icon: Palette },
  { id: 3, title: 'Logo Upload', icon: Upload },
  { id: 4, title: 'Platforms', icon: Share2 },
]

export default function Onboarding({ onSave }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [businessName, setBusinessName] = useState('')
  const [brandColors, setBrandColors] = useState(['#4f46e5', '#7c3aed'])
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [platforms, setPlatforms] = useState([])

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const togglePlatform = (id) => {
    setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const toggleColor = (color) => {
    setBrandColors(prev => {
      if (prev.includes(color)) return prev.filter(c => c !== color)
      if (prev.length >= 3) return [...prev.slice(1), color]
      return [...prev, color]
    })
  }

  const handleFinish = () => {
    onSave({ businessName, brandColors, logoPreview, platforms })
    navigate('/dashboard')
  }

  const canProceed = () => {
    if (step === 1) return businessName.trim().length > 0
    if (step === 2) return brandColors.length > 0
    if (step === 4) return platforms.length > 0
    return true
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-4 shadow-card">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Set up your brand</h1>
          <p className="text-text-secondary">Let's configure your campaign settings</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <button
                onClick={() => s.id < step && setStep(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  step === s.id ? 'gradient-primary text-white shadow-soft' :
                  step > s.id ? 'bg-green-100 text-green-700' :
                  'bg-white/60 text-text-secondary'
                }`}
              >
                {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                <span className="hidden sm:inline">{s.title}</span>
              </button>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${step > s.id ? 'bg-green-300' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-3xl p-8 shadow-card">
          {/* Step 1: Business Name */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Building2 className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-text">What's your business name?</h2>
                <p className="text-text-secondary text-sm mt-1">This will appear on your campaign creatives</p>
              </div>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border border-border bg-white/60 focus:outline-none focus:border-primary input-glow transition-all text-text text-lg text-center"
                placeholder="Enter your business name"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Brand Colors */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Palette className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-text">Choose brand colors</h2>
                <p className="text-text-secondary text-sm mt-1">Select up to 3 colors for your campaigns</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`w-14 h-14 rounded-2xl transition-all cursor-pointer ${brandColors.includes(color) ? 'ring-3 ring-offset-3 ring-primary scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-3 mt-4">
                {brandColors.map((color, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-border">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs font-mono text-text-secondary">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Logo */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-text">Upload your logo</h2>
                <p className="text-text-secondary text-sm mt-1">Recommended: 1:1 ratio, PNG or JPG</p>
              </div>
              <label className="flex flex-col items-center justify-center w-48 h-48 mx-auto rounded-3xl border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors bg-white/40 overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-text-secondary mb-2" />
                    <span className="text-sm text-text-secondary">Click to upload</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
            </div>
          )}

          {/* Step 4: Platforms */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Share2 className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-text">Select your platforms</h2>
                <p className="text-text-secondary text-sm mt-1">Where do you want to publish campaigns?</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      platforms.includes(p.id) ? 'border-primary bg-primary/5' : 'border-border bg-white/60 hover:border-primary/30'
                    }`}
                  >
                    <p.icon className="w-5 h-5" style={{ color: p.color }} />
                    <span className="font-medium text-text">{p.name}</span>
                    {platforms.includes(p.id) && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={() => setStep(s => s - 1)}
              className={`px-6 py-3 rounded-xl text-text-secondary hover:text-text transition-colors cursor-pointer ${step === 1 ? 'invisible' : ''}`}
            >
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
