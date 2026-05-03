import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Loader2, Monitor, Shield } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const serif = "'Noto Serif', serif"
const sans = 'Manrope, sans-serif'

export default function CampaignView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [heroIdx, setHeroIdx] = useState(0)

  useEffect(() => {
    const run = async () => {
      try {
        const userRaw = localStorage.getItem('ai-campaign-user')
        const user = userRaw ? JSON.parse(userRaw) : null
        if (!user?.access_token) throw new Error('Not authenticated')
        const res = await fetch(`${API_URL}/campaigns/${id}`, {
          headers: { Authorization: `Bearer ${user.access_token}` },
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.detail || 'Failed to load')
        setCampaign(data.campaign)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  const variations = (campaign?.metadata?.variations) || []
  const displayImages = variations.length > 0
    ? variations
    : (campaign?.image ? [{ id: 'A', label: 'Campaign', image: campaign.image }] : [])
  const hero = displayImages[heroIdx] || displayImages[0]

  const downloadImage = (dataUrl, filename) => {
    const a = document.createElement('a')
    a.href = dataUrl; a.download = filename
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }
  const handleExportAll = async () => {
    const base = (campaign?.title || 'campaign').replace(/\s+/g, '_').toLowerCase()
    for (let i = 0; i < displayImages.length; i++) {
      downloadImage(displayImages[i].image, `${base}-${displayImages[i].id || i}.png`)
      if (i < displayImages.length - 1) await new Promise(r => setTimeout(r, 250))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FCF9F8' }}>
        <Loader2 className="animate-spin" size={24} style={{ color: '#775A19' }} />
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#FCF9F8' }}>
        <div style={{ fontFamily: serif, fontSize: 24, color: '#1C1B1B' }}>Campaign not found</div>
        <div style={{ fontFamily: sans, fontSize: 13, color: '#dc2626' }}>{error}</div>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-xl cursor-pointer" style={{ background: '#775A19', color: 'white', fontFamily: sans, fontSize: 12 }}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  const meta = campaign.metadata || {}

  return (
    <div className="min-h-screen" style={{ background: '#FCF9F8' }}>
      <div className="fixed top-0 left-0 right-0 z-20 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3 sm:h-[80px] gap-2 sm:gap-0"
        style={{ background: 'rgba(252,249,248,0.80)', borderBottom: '1px solid rgba(209,197,180,0.10)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 cursor-pointer" style={{ color: '#5F5E5E' }}>
          <ArrowLeft size={14} />
          <span className="hidden sm:inline" style={{ fontFamily: sans, fontSize: 14, fontWeight: 500 }}>Back to Dashboard</span>
        </button>
        <span style={{ fontFamily: serif, fontSize: 16, fontStyle: 'italic', color: '#775A19' }}>Atelier AI Studio</span>
        <button onClick={handleExportAll} disabled={displayImages.length === 0}
          className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl cursor-pointer text-sm"
          style={{ background: '#775A19', color: 'white', fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: displayImages.length === 0 ? 0.5 : 1 }}>
          <Download size={12} /> <span className="hidden sm:inline">Export All ({displayImages.length})</span><span className="sm:hidden">Export</span>
        </button>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-[100px] sm:pt-[112px] pb-8 sm:pb-12">
        <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: '#775A19', marginBottom: 8 }}>
          {campaign.status} &bull; {campaign.platform}
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(24px, 5vw, 36px)', color: '#1C1B1B', marginBottom: 'clamp(16px, 4vw, 32px)' }}>{campaign.title}</h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8 sm:mb-12">
          <div className="flex-1 rounded-3xl overflow-hidden" style={{ background: '#F6F3F2', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
            {hero ? (
              <img src={hero.image} alt={hero.label} className="w-full object-cover" style={{ minHeight: 'clamp(300px, 60vw, 600px)' }} />
            ) : (
              <div style={{ minHeight: 'clamp(300px, 60vw, 600px)' }} className="w-full flex items-center justify-center">
                <span style={{ fontFamily: sans, fontSize: 14, color: '#7F7667' }}>No images available</span>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[360px] lg:shrink-0 flex flex-col gap-4 sm:gap-6">
            <div className="p-4 sm:p-8 rounded-3xl" style={{ background: 'white', outline: '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }}>
              <div className="mb-4 sm:mb-6" style={{ fontFamily: serif, fontSize: 'clamp(16px, 3vw, 20px)', color: '#1C1B1B' }}>Campaign Metadata</div>
              {[
                { label: 'Model', value: meta.muse || '—' },
                { label: 'Attire', value: meta.draping || '—' },
                { label: 'Backdrop', value: meta.location || '—' },
                { label: 'Date', value: campaign.date || '—' },
              ].map((row, i, arr) => (
                <div key={row.label} className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(209,197,180,0.10)' : 'none' }}>
                  <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>{row.label}</span>
                  <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 500, color: '#1C1B1B' }}>{row.value}</span>
                </div>
              ))}
              <div className="mt-6 p-4 rounded-lg" style={{ background: '#F6F3F2' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} style={{ color: '#775A19' }} />
                  <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: '#775A19' }}>Licensing Ready</span>
                </div>
                <p style={{ fontFamily: sans, fontSize: 11, color: '#5F5E5E', lineHeight: '17.88px' }}>
                  Cleared for commercial campaign use.
                </p>
              </div>
            </div>

            {displayImages.length > 1 && (
              <div>
                <div className="mb-3" style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>
                  All Variations ({displayImages.length}) — click to preview
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {displayImages.map((v, i) => (
                    <img key={v.id || i} src={v.image} alt={v.label} onClick={() => setHeroIdx(i)}
                      className="w-full aspect-square rounded-lg object-cover cursor-pointer hover:opacity-80"
                      style={{ outline: i === heroIdx ? '2px solid #775A19' : '1px solid rgba(209,197,180,0.20)', outlineOffset: -1 }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
