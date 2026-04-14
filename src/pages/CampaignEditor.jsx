import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, X, Check, RefreshCw, Download, Clock, Lock, Monitor, Shield, Loader2 } from 'lucide-react'
import Star from '../assets/Star'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const serif = "'Noto Serif', serif"
const sans = 'Manrope, sans-serif'
const nimbus = "'Nimbus Sans', Manrope, sans-serif"

const FALLBACK_VARIATIONS = [
  { id: 'A', label: 'Variation A', image: 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=500&h=670&fit=crop' },
  { id: 'B', label: 'Variation B', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&h=670&fit=crop' },
  { id: 'C', label: 'Variation C', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=670&fit=crop' },
  { id: 'D', label: 'Variation D', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=670&fit=crop' },
]

export default function CampaignEditor({ brand }) {
  const navigate = useNavigate()

  // Load generated images from sessionStorage (set by CampaignCreate)
  const { generatedData, VARIATIONS } = useMemo(() => {
    const raw = sessionStorage.getItem('campaign-generated')
    if (raw) {
      try {
        const data = JSON.parse(raw)
        const imgs = (data.images || [])
          .filter(img => img.image)
          .map(img => ({ id: img.id, label: img.label, image: img.image }))
        return {
          generatedData: data,
          VARIATIONS: imgs.length > 0 ? imgs : FALLBACK_VARIATIONS,
        }
      } catch { /* fall through */ }
    }
    return { generatedData: null, VARIATIONS: FALLBACK_VARIATIONS }
  }, [])

  const metadata = generatedData?.metadata || null

  const [step, setStep] = useState(2)
  const [selectedVariations, setSelectedVariations] = useState(new Set())
  const [refinementPrompt, setRefinementPrompt] = useState('')
  const [hoveredVariation, setHoveredVariation] = useState(null)
  const [published, setPublished] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [variations, setVariations] = useState(VARIATIONS)

  const handleRegenerate = async () => {
    if (!generatedData || regenerating) return
    setRegenerating(true)
    try {
      // Re-read the stored campaign config from sessionStorage
      const raw = sessionStorage.getItem('campaign-generated')
      if (!raw) return
      const prevData = JSON.parse(raw)
      // We need the original jewelry image — stored in campaign-config
      const configRaw = sessionStorage.getItem('campaign-config')
      if (!configRaw) return
      const config = JSON.parse(configRaw)

      const res = await fetch(`${API_URL}/campaign/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          refinement: refinementPrompt || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Regeneration failed')

      const imgs = (data.images || [])
        .filter(img => img.image)
        .map(img => ({ id: img.id, label: img.label, image: img.image }))
      if (imgs.length > 0) {
        setVariations(imgs)
        setSelectedVariations(new Set())
        sessionStorage.setItem('campaign-generated', JSON.stringify(data))
      }
    } catch (err) {
      console.error('Regeneration error:', err)
    } finally {
      setRegenerating(false)
    }
  }

  // Pick first selected variation for step 3 preview
  const reviewVariation = variations.find(v => selectedVariations.has(v.id)) || variations[0]

  const toggleVariation = (id) => {
    setSelectedVariations(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handlePublish = () => {
    setPublished(true)
    setTimeout(() => navigate('/dashboard'), 1800)
  }

  /* ─── Shared Top Nav ─── */
  const TopNav = ({ backLabel, backAction, stepLabel }) => (
    <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-8 h-[80px]"
      style={{ background: 'rgba(252,249,248,0.80)', borderBottom: '1px solid rgba(209,197,180,0.10)', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center gap-6">
        <button onClick={backAction} className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70" style={{ color: '#5F5E5E' }}>
          <ArrowLeft size={14} />
          <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 500 }}>{backLabel}</span>
        </button>
        <div style={{ width: 1, height: 24, background: 'rgba(209,197,180,0.30)' }} />
        <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, fontStyle: 'italic', color: '#775A19' }}>Atelier AI Studio</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#F6F3F2' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: '#775A19' }} />
          <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#5F5E5E' }}>{stepLabel}</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-6 py-2.5 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
          style={{ background: '#313030', color: '#F3F0EF' }}>
          <X size={12} />
          <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Exit Studio</span>
        </button>
      </div>
    </div>
  )

  /* ═══════════════════════════════════════════
     STEP 2: Creative Canvas
     ═══════════════════════════════════════════ */
  if (step === 2) {
    return (
      <div className="min-h-screen" style={{ background: '#FCF9F8' }}>
        <TopNav backLabel="Back to Dashboard" backAction={() => navigate('/dashboard')} stepLabel="Gemology AI v4.2 Active" />

        <div className="max-w-[1152px] mx-auto px-8 pt-[112px] pb-12">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#F6F3F2' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#775A19' }} />
                <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#5F5E5E' }}>Step 2: Creative Canvas</span>
              </div>
              <span style={{ fontFamily: serif, fontSize: 24, fontWeight: 400, color: '#1C1B1B' }}>Generation Canvas</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/campaign/create')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: '#F0EDED', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
                <ArrowLeft size={10} style={{ color: '#4E4639' }} />
                <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#4E4639' }}>Back to Configuration</span>
              </button>
              <button onClick={() => { if (selectedVariations.size > 0) setStep(3) }}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: '#775A19', boxShadow: '0px 4px 6px -4px rgba(119,90,25,0.20), 0px 10px 15px -3px rgba(119,90,25,0.20)', opacity: selectedVariations.size > 0 ? 1 : 0.5 }}>
                <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'white' }}>Proceed to Step 3: Final Review</span>
                <ArrowRight size={10} style={{ color: 'white' }} />
              </button>
            </div>
          </div>

          {/* Variation Grid — 4 columns, all selectable */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            {variations.map(v => {
              const isSelected = selectedVariations.has(v.id)
              const isHovered = hoveredVariation === v.id
              return (
                <div key={v.id}
                  className="relative rounded-2xl overflow-hidden cursor-pointer transition-all"
                  style={{
                    outline: isSelected ? '2px solid #775A19' : '1px solid rgba(209,197,180,0.20)',
                    outlineOffset: isSelected ? -2 : -1,
                    boxShadow: isSelected ? '0px 0px 0px 4px rgba(119,90,25,0.10)' : 'none',
                  }}
                  onClick={() => toggleVariation(v.id)}
                  onMouseEnter={() => setHoveredVariation(v.id)}
                  onMouseLeave={() => setHoveredVariation(null)}
                >
                  <img src={v.image} alt={v.label} className="w-full h-[358px] object-cover" />

                  {/* Selected overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: 'rgba(0,0,0,0.20)' }}>
                      <div className="px-6 py-2 rounded-xl" style={{ background: '#775A19' }}>
                        <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'white' }}>Selected</span>
                      </div>
                      <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 1, color: 'white' }}>{v.label}</span>
                    </div>
                  )}

                  {/* Hover overlay (unselected) */}
                  {!isSelected && isHovered && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: 'rgba(0,0,0,0.40)' }}>
                      <div className="px-6 py-2 rounded-xl" style={{ background: 'white' }}>
                        <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'black' }}>Select for Export</span>
                      </div>
                      <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 1, color: 'white' }}>{v.label}</span>
                    </div>
                  )}

                  {/* Checkmark badge */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#775A19' }}>
                      <Check size={14} style={{ color: 'white' }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Refinement Prompt */}
          <div className="max-w-[768px] mx-auto relative">
            <div className="absolute -inset-4 rounded-3xl opacity-30" style={{ background: 'linear-gradient(90deg, rgba(119,90,25,0.10) 0%, rgba(119,90,25,0) 50%, rgba(119,90,25,0.10) 100%)', filter: 'blur(32px)' }} />
            <div className="relative flex items-end gap-4 p-4 rounded-[40px]"
              style={{ background: 'rgba(252,249,248,0.70)', outline: '1px solid rgba(119,90,25,0.10)', outlineOffset: -1, backdropFilter: 'blur(6px)', boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)' }}>
              {/* Icon */}
              <div className="p-3 rounded-xl shrink-0" style={{ background: 'rgba(119,90,25,0.10)' }}>
                <Star />
              </div>
              {/* Input area */}
              <div className="flex-1 flex flex-col gap-1">
                <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>Refinement Prompt</span>
                <textarea
                  value={refinementPrompt}
                  onChange={e => setRefinementPrompt(e.target.value)}
                  placeholder="e.g., 'Enhance the depth of the embroidery and add a bokeh effect...'"
                  rows={2}
                  className="w-full bg-transparent outline-none resize-none"
                  style={{ fontFamily: serif, fontSize: 18, fontWeight: 400, color: '#1C1B1B', lineHeight: '28px' }}
                />
              </div>
              {/* Actions */}
              <div className="flex items-center gap-3 pb-2 pr-2 shrink-0">
                <button className="p-3 cursor-pointer" style={{ color: '#5F5E5E' }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </button>
                <button onClick={handleRegenerate} disabled={regenerating}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
                  style={{ background: '#775A19', boxShadow: '0px 4px 6px -4px rgba(119,90,25,0.20), 0px 10px 15px -3px rgba(119,90,25,0.20)', opacity: regenerating ? 0.6 : 1 }}>
                  {regenerating ? (
                    <>
                      <Loader2 size={12} className="animate-spin" style={{ color: 'white' }} />
                      <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'white' }}>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'white' }}>Regenerate</span>
                      <RefreshCw size={12} style={{ color: 'white' }} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div className="max-w-[896px] mx-auto mt-16 pt-8 flex items-center justify-center gap-12" style={{ borderTop: '1px solid rgba(209,197,180,0.10)' }}>
            <div className="flex items-center gap-2" style={{ color: '#7F7667' }}>
              <Lock size={10} />
              <span style={{ fontFamily: sans, fontSize: 9, textTransform: 'uppercase', letterSpacing: 2.25 }}>Encrypted Creative Pipeline</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#7F7667' }}>
              <Monitor size={12} />
              <span style={{ fontFamily: sans, fontSize: 9, textTransform: 'uppercase', letterSpacing: 2.25 }}>8K Cinematic Output Ready</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#7F7667' }}>
              <Clock size={10} />
              <span style={{ fontFamily: sans, fontSize: 9, textTransform: 'uppercase', letterSpacing: 2.25 }}>Iteration #2</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════
     STEP 3: Final Review
     ═══════════════════════════════════════════ */
  return (
    <div className="min-h-screen" style={{ background: '#FCF9F8' }}>
      <TopNav backLabel="Back to Canvas" backAction={() => setStep(2)} stepLabel="Step 3: Final Review" />

      {/* Published overlay */}
      {published && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(6px)' }}>
          <div className="p-12 rounded-3xl text-center" style={{ background: 'white', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(119,90,25,0.10)' }}>
              <Check size={32} style={{ color: '#775A19' }} />
            </div>
            <h3 style={{ fontFamily: serif, fontSize: 24, color: '#1C1B1B', marginBottom: 8 }}>Campaign Published!</h3>
            <p style={{ fontFamily: sans, fontSize: 14, color: '#7F7667' }}>Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-8 pt-[128px] pb-12">
        {/* Title Row */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: '#775A19', marginBottom: 8 }}>Final Step</div>
            <h1 style={{ fontFamily: serif, fontSize: 36, fontWeight: 400, color: '#1C1B1B', lineHeight: '40px' }}>Step 3: Final Review</h1>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: '#F0EDED', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
            <Download size={10} style={{ color: '#4E4639' }} />
            <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#4E4639' }}>Export Asset</span>
          </button>
        </div>

        {/* Content: Image + Metadata side by side */}
        <div className="flex gap-8 mb-12">
          {/* Main Image */}
          <div className="flex-1 relative rounded-3xl overflow-hidden"
            style={{ background: '#F6F3F2', boxShadow: '0px 40px 100px -20px rgba(119,90,25,0.15)', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
            <img src={reviewVariation.image} alt="Final render" className="w-full object-cover" style={{ minHeight: 600 }} />
            {/* 8K badge */}
            <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.40)', outline: '1px solid rgba(255,255,255,0.20)', outlineOffset: -1, backdropFilter: 'blur(6px)' }}>
              <Monitor size={12} style={{ color: 'white' }} />
              <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: 'white' }}>8K Render Master</span>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-[360px] shrink-0 flex flex-col gap-8">
            {/* Campaign Metadata */}
            <div className="p-8 rounded-3xl" style={{ background: 'white', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
              <div className="mb-6" style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, color: '#1C1B1B' }}>Campaign Metadata</div>
              {[
                { label: 'Jewelry', value: metadata ? 'Uploaded Asset' : 'Diamond Ring' },
                { label: 'Model', value: metadata ? metadata.muse : 'Selected (AI Muse #1)' },
                { label: 'Attire', value: metadata ? metadata.draping : 'Kanjeevaram Silk' },
                { label: 'Backdrop', value: metadata ? metadata.location : 'Palace Courtyard' },
              ].map((row, i, arr) => (
                <div key={row.label} className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(209,197,180,0.10)' : 'none' }}>
                  <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>{row.label}</span>
                  <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 500, color: '#1C1B1B' }}>{row.value}</span>
                </div>
              ))}

              {/* Licensing Ready */}
              <div className="mt-6 p-4 rounded-lg" style={{ background: '#F6F3F2', outline: '1px solid rgba(209,197,180,0.10)', outlineOffset: -1 }}>
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={14} style={{ color: '#775A19' }} />
                  <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: '#775A19' }}>Licensing Ready</span>
                </div>
                <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 400, color: '#5F5E5E', lineHeight: '17.88px' }}>
                  Generated visual adheres to commercial heritage brand guidelines and is cleared for digital campaign use.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 py-4 rounded-2xl text-center cursor-pointer transition-opacity hover:opacity-80"
                style={{ outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1, fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#5F5E5E' }}>
                Save as Draft
              </button>
              <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-2xl text-center cursor-pointer transition-opacity hover:opacity-80"
                style={{ outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1, fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#5F5E5E' }}>
                New Version
              </button>
            </div>

            {/* Selected Variations Preview */}
            {selectedVariations.size > 1 && (
              <div>
                <div className="mb-3" style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>
                  All Selected ({selectedVariations.size})
                </div>
                <div className="flex gap-2">
                  {variations.filter(v => selectedVariations.has(v.id)).map(v => (
                    <img key={v.id} src={v.image} alt={v.label} className="w-16 h-16 rounded-lg object-cover"
                      style={{ outline: reviewVariation.id === v.id ? '2px solid #775A19' : '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-10" style={{ borderTop: '1px solid rgba(209,197,180,0.10)' }}>
          <div className="flex items-center gap-10">
            <div>
              <div className="mb-1" style={{ fontFamily: sans, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.8, color: '#7F7667' }}>Creation Log</div>
              <div className="flex items-center gap-2">
                <Clock size={10} style={{ color: '#5F5E5E' }} />
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: '#1C1B1B' }}>Completed in 42s &bull; Iteration #1</span>
              </div>
            </div>
            <div>
              <div className="mb-1" style={{ fontFamily: sans, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.8, color: '#7F7667' }}>Encrypted Pipeline</div>
              <div className="flex items-center gap-2">
                <Lock size={10} style={{ color: '#5F5E5E' }} />
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: '#1C1B1B' }}>Secure Artifact Storage</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="px-8 py-4 cursor-pointer transition-opacity hover:opacity-70"
              style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#5F5E5E' }}>
              Preview on Device
            </button>
            <button onClick={handlePublish}
              className="flex items-center gap-3 px-12 py-5 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(90deg, #775A19, #C5A059)', boxShadow: '0px 25px 50px -12px rgba(119,90,25,0.30)' }}>
              <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.1, color: 'white' }}>Finalize & Publish</span>
              <Star />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
