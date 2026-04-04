import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { HexColorPicker } from 'react-colorful'
import Diamond from '../assets/Diamond'
import Gold from '../assets/Gold'
import Diamond2 from '../assets/Diamond2'
import Bridal from '../assets/Bridal'
import Mixed from '../assets/Mixed'
import Premiumluxry from '../assets/Premiumluxry'
import Festive from '../assets/Festive'
import MinimalModern from '../assets/MinimalModern'

const REGIONS = [
  'North America',
  'Europe',
  'Middle East',
  'South Asia',
  'East Asia',
  'Southeast Asia',
  'Africa',
  'South America',
  'Oceania',
]

const CATEGORIES = [
  { id: 'gold', name: 'Gold', Component: Gold },
  { id: 'diamond', name: 'Diamond', Component: Diamond2 },
  { id: 'bridal', name: 'Bridal', Component: Bridal },
  { id: 'mixed', name: 'Mixed', Component: Mixed },
]

const STYLE_PRESETS = [
  { id: 'premium', name: 'Premium Luxury', desc: 'Deep Tones • Gold Accents', bg: '#313030', Component: Premiumluxry },
  { id: 'festive', name: 'Festive', desc: 'Vibrant • Celebration Focus', bg: '#EAE7E7', Component: Festive },
  { id: 'minimal', name: 'Minimal Modern', desc: 'Light • Architectural Clean', bg: '#FFFFFF', Component: MinimalModern },
]

const TYPOGRAPHY_OPTIONS = [
  { id: 'serif', name: 'Traditional Serif', family: 'serif', desc: 'Conveys history, craftsmanship, and enduring elegance. Recommended for heritage brands.' },
  { id: 'sans', name: 'Modern Sans', family: 'sans-serif', desc: 'Clean, geometric, and forward-thinking. Best for contemporary and digital-first labels.' },
]

const BASE_CANVASES = [
  { id: 'warm', color: '#FCF9F8' },
  { id: 'muted', color: '#F6F3F2' },
  { id: 'dark', color: '#313030' },
  { id: 'deep', color: '#1C1917' },
]

// Upload icon SVG
const UploadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 25V13M20 13L15 18M20 13L25 18" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 25C10 27.7614 12.2386 30 15 30H25C27.7614 30 30 27.7614 30 25" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Lock icon SVG
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.375 5.833V4.083a2.625 2.625 0 015.25 0v1.75M3.5 5.833h7a1.167 1.167 0 011.167 1.167v4.667A1.167 1.167 0 0110.5 12.833h-7a1.167 1.167 0 01-1.167-1.167V7A1.167 1.167 0 013.5 5.833z" stroke="#9B8E7E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Info icon SVG
const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="8" stroke="#C5A059" strokeWidth="1.2" />
    <path d="M9 8v4M9 6h.007" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export default function Onboarding({ onSave }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [storeName, setStoreName] = useState('')
  const [region, setRegion] = useState('')
  const [category, setCategory] = useState('')
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [stylePreset, setStylePreset] = useState('premium')
  const [typography, setTypography] = useState('serif')
  const [baseCanvas, setBaseCanvas] = useState('warm')
  const [primaryColor, setPrimaryColor] = useState('#775A19')
  const [secondaryColor, setSecondaryColor] = useState('#C5A059')
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false)
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false)
  const fileInputRef = useRef(null)

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const canProceedStep1 = storeName.trim().length > 0
  const canProceedStep2 = stylePreset && typography

  const handleFinish = () => {
    onSave({ businessName: storeName, region, category, logoPreview, stylePreset, typography, baseCanvas })
    navigate('/dashboard')
  }

  const handleSkip = () => {
    onSave({ businessName: storeName || 'My Store', region: region || 'North America', category: category || 'mixed', logoPreview: null, platforms: ['instagram'] })
    navigate('/dashboard')
  }

  const progressPercent = step === 1 ? 50 : 100

  return (
    <div className="min-h-screen bg-surface-muted font-sans selection:bg-primary/20 flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-10 py-5 border-b border-border-beige/20">
        <h1 className="text-xl font-serif italic text-text-dark tracking-tight">
          L'Atelier AI
        </h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-secondary uppercase tracking-[1.5px]">
            Step {step < 10 ? `0${step}` : step} of 02
          </span>
          <div className="w-24 h-[3px] bg-border-beige/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-primary-light rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto px-10 pt-12 pb-16 flex flex-col max-w-[1280px]">

        {step === 1 && (
          <>
            {/* Title */}
            <div className="text-center mb-12">
              <h2 className="text-[42px] font-serif text-text-dark leading-tight mb-4">
                Establish Your Digital Atelier
              </h2>
              <p className="text-sm text-secondary leading-relaxed max-w-lg mx-auto">
                Define the core identity of your luxury business. This information will tailor the
                <br />AI experience for your brand's unique aesthetic.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="flex flex-col gap-8">
                {/* Store Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-secondary uppercase tracking-[1.5px]">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Maison de Bijoux"
                    className="w-full px-5 py-4 bg-white border border-border-beige/40 rounded-lg outline-none text-base text-text-dark placeholder:text-text-muted/50 focus:border-primary transition-all"
                    autoFocus
                  />
                </div>

                {/* Business Location */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-secondary uppercase tracking-[1.5px]">
                    Business Location
                  </label>
                  <div className="relative">
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-border-beige/40 rounded-lg outline-none text-base text-text-dark appearance-none cursor-pointer focus:border-primary transition-all"
                    >
                      <option value="">Select Region</option>
                      {REGIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#9B8E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Primary Category */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-semibold text-secondary uppercase tracking-[1.5px]">
                    Primary Category
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 ${category === cat.id
                          ? 'ring-2 ring-primary ring-offset-2 scale-[1.02]'
                          : 'hover:scale-[1.01] hover:shadow-lg'
                          }`}
                        style={{ aspectRatio: '4/5' }}
                      >
                        <div className="w-full h-full flex items-center justify-center bg-black/5">
                          <cat.Component />
                        </div>
                        {/* Label overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                          <span className="text-white text-sm font-serif italic tracking-wide">
                            {cat.name}
                          </span>
                        </div>
                        {/* Selected check */}
                        {category === cat.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                              <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                {/* Brand Seal / Logo */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-secondary uppercase tracking-[1.5px]">
                    Brand Seal / Logo
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 bg-white min-h-[280px] ${isDragging
                      ? 'border-primary bg-primary/5 scale-[1.01]'
                      : 'border-border-beige/40 hover:border-primary/50'
                      }`}
                  >
                    {logoPreview ? (
                      <div className="relative w-full h-full min-h-[280px] flex items-center justify-center p-6">
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="max-w-full max-h-[240px] object-contain rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setLogo(null)
                            setLogoPreview(null)
                          }}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1 1L9 9M9 1L1 9" stroke="#1C1B1B" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadIcon />
                        <div className="text-center">
                          <p className="text-sm text-secondary">
                            Drag your signature mark here or{' '}
                            <span className="text-primary font-semibold underline underline-offset-2">
                              browse files
                            </span>
                          </p>
                          <p className="text-[11px] text-text-muted/60 mt-1.5">
                            SVG, PNG or JPEG (Max 5MB)
                          </p>
                        </div>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* AI Info Tip */}
                <div className="flex gap-3 p-5 rounded-xl bg-white border border-border-beige/30">
                  <div className="shrink-0 mt-0.5">
                    <InfoIcon />
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    "Our AI uses your brand's primary category and logo colors to suggest bespoke marketing themes. Choose the category that represents 70% of your current inventory."
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Title – left aligned */}
            <div className="mb-16">
              <h2 className="text-[52px] font-serif text-text-dark leading-none mb-4">
                Define Your Visual Signature
              </h2>
              <p className="text-[16px] text-secondary leading-relaxed max-w-[672px]">
                Establish the aesthetic foundation for your brand. Our AI uses these parameters
                <br />to curate every campaign, ensuring consistent luxury across all touchpoints.
              </p>
            </div>

            {/* Two Column: Left (presets + type) | Right (palette + actions) */}
            <div className="flex gap-12 w-full">
              {/* ── Left Column ── */}
              <div className="flex-1 flex flex-col gap-16">
                {/* Style Presets */}
                <div className="flex flex-col gap-8">
                  <h3 className="text-[24px] font-serif text-text-dark leading-8">Style Presets</h3>
                  <div className="grid grid-cols-3 gap-5">
                    {STYLE_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => setStylePreset(preset.id)}
                        className={`relative overflow-hidden rounded-xl cursor-pointer group text-left transition-all duration-300 ${stylePreset === preset.id
                          ? 'ring-2 ring-primary ring-offset-2 scale-[1.02]'
                          : 'hover:scale-[1.01] hover:shadow-lg'
                          }`}
                        style={{ aspectRatio: '248/311', background: preset.bg }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                          <preset.Component />
                        </div>
                        {/* gradient overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-3/4" style={{
                          background: preset.id === 'premium'
                            ? 'linear-gradient(0deg, #1C1B1B 0%, rgba(28,27,27,0) 100%)'
                            : preset.id === 'festive'
                              ? 'linear-gradient(0deg, rgba(78,70,57,0.70) 0%, rgba(78,70,57,0) 100%)'
                              : 'linear-gradient(0deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)',
                          opacity: 0.9
                        }} />
                        {/* labels */}
                        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-1">
                          <span className="text-lg font-serif" style={{ color: preset.id === 'premium' ? '#FFDEA5' : '#1C1B1B' }}>
                            {preset.name}
                          </span>
                          <span className="text-[11px] uppercase tracking-[1.2px]" style={{ color: preset.id === 'premium' ? '#C8C6C5' : '#5F5E5E' }}>
                            {preset.desc}
                          </span>
                        </div>
                        {/* selected badge */}
                        {stylePreset === preset.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                              <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography Selection */}
                <div className="flex flex-col gap-8">
                  <h3 className="text-[24px] font-serif text-text-dark leading-8">Typography Selection</h3>
                  <div className="grid grid-cols-2 gap-5">
                    {TYPOGRAPHY_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setTypography(opt.id)}
                        className={`relative p-8 rounded-xl text-left cursor-pointer transition-all duration-300 ${typography === opt.id
                          ? 'ring-2 ring-primary ring-offset-2 scale-[1.02] bg-surface-muted'
                          : 'bg-surface-muted hover:bg-surface-muted/80 hover:scale-[1.01] hover:shadow-lg'
                          }`}
                      >
                        {typography === opt.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                              <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                        <span className="block text-[32px] leading-10 text-text-dark" style={{ fontFamily: opt.family }}>
                          {opt.name}
                        </span>
                        <p className="text-sm text-secondary leading-relaxed mt-3">
                          {opt.desc}
                        </p>
                        {typography === opt.id ? (
                          <div className="flex items-center gap-2 mt-4">
                            <span className="text-[12px] uppercase tracking-[1.2px] text-primary font-semibold">Selected</span>
                          </div>
                        ) : (
                          <span className="block text-[12px] uppercase tracking-[1.2px] text-secondary mt-4 opacity-0 font-semibold">Select Style</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right Column (sidebar) ── */}
              <div className="w-[340px] shrink-0 flex flex-col gap-8">
                {/* Color Palette Card */}
                <div className="p-8 bg-white shadow-[0_20px_50px_rgba(28,27,27,0.05)] rounded flex flex-col gap-6" style={{ outline: '1px solid rgba(209,197,180,0.10)', outlineOffset: '-1px' }}>
                  <h4 className="text-xl font-serif text-text-dark">Color Palette</h4>

                  {/* Primary */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[12px] uppercase tracking-[1.2px] text-secondary">Primary Signature</span>
                    <div className="flex items-center gap-4 relative">
                      <div className="w-16 h-16 rounded-xl shadow-[inset_0_2px_4px_1px_rgba(0,0,0,0.05)]" style={{ background: primaryColor, border: '1px solid rgba(209,197,180,0.20)' }} />
                      <div className="flex-1">
                        <span className="block text-sm font-mono uppercase text-text-dark">{primaryColor}</span>
                        <span className="block text-[12px] text-secondary">Aureolin Gold</span>
                      </div>
                      <button onClick={() => setShowPrimaryPicker(!showPrimaryPicker)} className="p-2 rounded-xl cursor-pointer hover:bg-surface-muted transition-colors">
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M12 2l3 3-9 9H3v-3l9-9z" stroke="#775A19" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>

                      {showPrimaryPicker && (
                        <div className="absolute z-50 top-full mt-2 right-0">
                          <div className="fixed inset-0" onClick={() => setShowPrimaryPicker(false)} />
                          <div className="relative z-10 shadow-2xl rounded-lg overflow-hidden border border-border-beige/20">
                            <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Secondary */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[12px] uppercase tracking-[1.2px] text-secondary">Secondary Accent</span>
                    <div className="flex items-center gap-4 relative">
                      <div className="w-16 h-16 rounded-xl shadow-[inset_0_2px_4px_1px_rgba(0,0,0,0.05)]" style={{ background: secondaryColor, border: '1px solid rgba(209,197,180,0.20)' }} />
                      <div className="flex-1">
                        <span className="block text-sm font-mono uppercase text-text-dark">{secondaryColor}</span>
                        <span className="block text-[12px] text-secondary">Brushed Brass</span>
                      </div>
                      <button onClick={() => setShowSecondaryPicker(!showSecondaryPicker)} className="p-2 rounded-xl cursor-pointer hover:bg-surface-muted transition-colors">
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M12 2l3 3-9 9H3v-3l9-9z" stroke="#775A19" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>

                      {showSecondaryPicker && (
                        <div className="absolute z-50 top-full mt-2 right-0">
                          <div className="fixed inset-0" onClick={() => setShowSecondaryPicker(false)} />
                          <div className="relative z-10 shadow-2xl rounded-lg overflow-hidden border border-border-beige/20">
                            <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Base Canvas */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[12px] uppercase tracking-[1.2px] text-secondary">Base Canvas</span>
                    <div className="flex gap-3">
                      {BASE_CANVASES.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setBaseCanvas(c.id)}
                          className="w-10 h-10 rounded cursor-pointer transition-all"
                          style={{
                            background: c.color,
                            border: baseCanvas === c.id ? '2px solid #775A19' : '1px solid rgba(209,197,180,0.20)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Insight Tip */}
                <div className="flex gap-3 p-5 rounded-xl bg-white border border-border-beige/30 mt-4">
                  <div className="shrink-0 mt-0.5">
                    <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path d="M9 1l1.5 3.5L14 6l-3.5 1.5L9 11 7.5 7.5 4 6l3.5-1.5L9 1z" stroke="#775A19" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11l.75 1.75L16.5 13.5l-1.75.75L14 16l-.75-1.75L11.5 13.5l1.75-.75L14 11z" stroke="#775A19" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div>
                    <span className="block text-[12px] font-bold text-text-dark leading-5">Atelier AI Insight</span>
                    <p className="text-[12px] text-secondary leading-5 mt-0.5">
                      Your selections will influence the AI's rendering engine. You can refine these settings later in the Visual Studio workspace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Spacer */}
        <div className="flex-1" />
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 w-full border-t border-border-beige/20 px-10 py-5 bg-surface-muted z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="w-full flex items-center justify-between">
          {/* Security note */}
          <div className="flex items-center gap-2">
            <LockIcon />
            <span className="text-[12px] text-secondary">
              Your data is stored securely in our private atelier cloud.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {step === 1 ? (
              <>
                <button
                  onClick={handleSkip}
                  className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px] hover:text-text-dark transition-colors cursor-pointer px-4 py-3"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => canProceedStep1 && setStep(2)}
                  disabled={!canProceedStep1}
                  className="px-8 py-3.5 bg-linear-to-r from-primary to-primary-light text-white text-[12px] font-bold uppercase tracking-[2px] rounded-sm hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to Step 2
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep(1)}
                  className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px] hover:text-text-dark transition-colors cursor-pointer px-4 py-3"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={!canProceedStep2}
                  className="px-8 py-3.5 text-white text-[12px] font-bold uppercase tracking-[2px] rounded-sm hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(90deg, #775A19 0%, #C5A059 100%)' }}
                >
                  Finish Setup
                </button>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
