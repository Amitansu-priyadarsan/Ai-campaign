import { useNavigate } from 'react-router-dom'
import { Plus, Bell, Settings, LogOut, BarChart3, Compass, Megaphone, LineChart, Tv, Upload, Palette, Type, Image, Eye, TrendingUp, Calendar, Clock, Instagram, Facebook, Play, PauseCircle, FileText, Layers, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Star from '../assets/Star'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const NAV_ITEMS = [
  { icon: BarChart3, label: 'Dashboard', key: 'dashboard' },
  { icon: Compass, label: 'Brand Identity', key: 'brand-identity' },
  { icon: Megaphone, label: 'Campaigns', key: 'campaigns' },
  { icon: LineChart, label: 'Insights', key: 'insights' },
  { icon: Tv, label: 'Studio', key: 'studio' },
  { icon: MessageCircle, label: 'AI Chat', key: 'ai-chat' },
]


/* Shared style helpers */
const serif = "'Noto Serif', serif"
const sans = 'Manrope, sans-serif'
const nimbus = "'Nimbus Sans', Manrope, sans-serif"

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-8">
    <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, color: '#1C1B1B', lineHeight: '28px' }}>{title}</div>
    {subtitle && <div style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 1, color: '#78716C', marginTop: 4 }}>{subtitle}</div>}
  </div>
)

/* ─── Section: Dashboard ─── */
function DashboardContent({ navigate, activeTab, setActiveTab, stats, analytics, campaigns }) {
  return (
    <>
      <div className="flex gap-6 mb-10">
        {/* Analytics Overview */}
        <div className="flex-1 min-h-[400px] p-8 rounded-lg flex flex-col justify-between" style={{ background: '#F6F3F2' }}>
          <div>
            <div className="flex items-start justify-between pb-8">
              <div>
                <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, color: '#1C1B1B', lineHeight: '28px' }}>Analytics Overview</div>
                <div style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 1, color: '#78716C', marginTop: 4, lineHeight: '15px' }}>Global Engagement Metrics</div>
              </div>
              <div className="flex gap-2">
                {['weekly', 'monthly'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className="px-3 py-1 rounded-sm cursor-pointer"
                    style={{ background: activeTab === tab ? '#E5E2E1' : 'rgba(119,90,25,0.10)', fontFamily: sans, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: activeTab === tab ? '#1C1B1B' : '#775A19' }}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-end gap-4 px-4 pb-4" style={{ height: 220 }}>
            {(analytics?.weeklyReach || []).map((d, i, arr) => {
              const max = Math.max(...arr.map(a => a.value), 1)
              const isLast = i === arr.length - 1
              const height = (d.value / max) * 195
              const label = d.value >= 1000 ? `${(d.value / 1000).toFixed(0)}k` : String(d.value)
              const opacity = isLast ? 1 : 0.1 + (i * 0.15)
              return (
                <div key={i} className="flex-1 relative flex flex-col items-center">
                  {isLast && d.value > 0 && <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: '#775A19', marginBottom: 8 }}>{label}</div>}
                  <div className="w-full rounded-t-sm" style={{ height: Math.max(height, 2), background: isLast ? '#C5A059' : `rgba(119,90,25,${opacity})` }} />
                </div>
              )
            })}
          </div>
          <div className="flex gap-0 pt-8" style={{ borderTop: '1px solid rgba(209,197,180,0.10)' }}>
            {[{ label: 'Impressions', value: stats?.totalReach ?? 0, color: '#1C1B1B' }, { label: 'Conversions', value: stats?.totalConversions ?? '0%', color: '#1C1B1B' }, { label: 'Revenue', value: stats?.revenue ?? '$0', color: '#775A19' }].map(m => (
              <div key={m.label} className="flex-1">
                <div style={{ fontFamily: nimbus, fontSize: 9, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 0.9, color: '#78716C' }}>{m.label}</div>
                <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 400, color: m.color, lineHeight: '32px' }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Promo Card */}
        <div className="w-[300px] shrink-0 p-8 rounded-lg relative overflow-hidden flex flex-col justify-center" style={{ background: '#775A19' }}>
          <div style={{ width: 192, height: 192, position: 'absolute', left: 144, top: 249, background: 'rgba(255,255,255,0.10)', borderRadius: 12, filter: 'blur(32px)' }} />
          <div className="relative z-10 flex flex-col">
            <div className="pb-6"><Star /></div>
            <div className="pb-4">
              <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 400, color: 'white', lineHeight: '30px' }}>Elevate your next<br />collection with AI-<br />driven aesthetics.</div>
            </div>
            <div style={{ minHeight: 91 }}>
              <p style={{ fontFamily: sans, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.70)', lineHeight: '22.75px' }}>Our generative engine analyzes<br />current high-jewelry trends to<br />propose bespoke campaign<br />visuals.</p>
            </div>
            <div className="pt-8">
              <button onClick={() => navigate('/campaign/create')} className="px-16 py-3 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: 'white', fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19' }}>Start Creation</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <SectionTitle title="Recent Campaigns" subtitle="Your campaign assets" />
        </div>
        <div className="grid grid-cols-4 gap-5">
          {(campaigns || []).slice(0, 3).map(c => (
            <div key={c.id} className="flex flex-col cursor-pointer group" onClick={() => navigate('/campaign/editor')}>
              <div className="rounded overflow-hidden flex items-center justify-center" style={{ background: '#F0EDED', minHeight: 268 }}>
                {c.image ? (
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" style={{ minHeight: 268 }} />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(119,90,25,0.10)' }}>
                    <Megaphone size={18} style={{ color: '#775A19' }} />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div style={{ fontFamily: serif, fontSize: 14, fontWeight: 400, color: '#1C1B1B', lineHeight: '20px' }}>{c.title}</div>
                <div style={{ fontFamily: nimbus, fontSize: 9, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 0.9, color: '#78716C', marginTop: 4 }}>{c.platform} &bull; {c.status}</div>
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center rounded cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: '#F6F3F2', outline: '1px solid rgba(209,197,180,0.30)', outlineOffset: -1, minHeight: 268 }}
            onClick={() => navigate('/campaign/create')}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'white', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' }}>
              <Plus size={20} style={{ color: '#775A19' }} />
            </div>
            <div style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#A8A29E' }}>
              {(campaigns || []).length === 0 ? 'Create Your First Campaign' : 'New Campaign'}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Section: Brand Identity ─── */
function BrandIdentityContent({ brand }) {
  const brandColors = brand?.colors || ['#775A19', '#C5A059', '#1C1B1B', '#F6F3F2']
  const brandFont = brand?.fontFamily || 'Noto Serif'
  const brandStyle = brand?.style || 'Elegant & Refined'

  return (
    <>
      <SectionTitle title="Brand Identity" subtitle="Your visual DNA" />

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Logo & Name */}
        <div className="p-8 rounded-lg" style={{ background: '#F6F3F2' }}>
          <div className="flex items-center gap-3 mb-6">
            <Image size={18} style={{ color: '#775A19' }} />
            <span style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19' }}>Logo & Identity</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center" style={{ background: '#775A19' }}>
              {brand?.logoUrl ? (
                <img src={brand.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-2xl" />
              ) : (
                <span style={{ fontFamily: serif, fontSize: 32, color: 'white' }}>{brand?.storeName?.[0] || 'A'}</span>
              )}
            </div>
            <div>
              <div style={{ fontFamily: serif, fontSize: 24, color: '#1C1B1B' }}>{brand?.storeName || "L'Atelier"}</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: '#78716C', marginTop: 4 }}>{brand?.category || 'Luxury Jewelry'} • {brand?.region || 'Global'}</div>
              <button className="mt-4 px-4 py-2 rounded-lg cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: 'rgba(119,90,25,0.08)', fontFamily: sans, fontSize: 11, fontWeight: 600, color: '#775A19' }}>
                <Upload size={12} className="inline mr-2" style={{ verticalAlign: 'middle' }} />Update Logo
              </button>
            </div>
          </div>
        </div>

        {/* Style Preset */}
        <div className="p-8 rounded-lg" style={{ background: '#F6F3F2' }}>
          <div className="flex items-center gap-3 mb-6">
            <Layers size={18} style={{ color: '#775A19' }} />
            <span style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19' }}>Style Preset</span>
          </div>
          <div style={{ fontFamily: serif, fontSize: 20, color: '#1C1B1B', marginBottom: 8 }}>{brandStyle}</div>
          <p style={{ fontFamily: sans, fontSize: 13, color: '#78716C', lineHeight: '20px', marginBottom: 16 }}>
            Sophisticated visual language with warm metallics, refined serif typography, and a muted earth-tone palette.
          </p>
          <div className="flex gap-3">
            {['Elegant & Refined', 'Bold & Modern', 'Soft & Minimal'].map(style => (
              <div key={style} className="px-4 py-2 rounded-lg cursor-pointer transition-colors"
                style={{ background: brandStyle === style ? 'rgba(119,90,25,0.12)' : 'white', fontFamily: sans, fontSize: 11, fontWeight: brandStyle === style ? 600 : 400, color: brandStyle === style ? '#775A19' : '#78716C', border: '1px solid rgba(209,197,180,0.20)' }}>
                {style}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Color Palette */}
        <div className="p-8 rounded-lg" style={{ background: '#F6F3F2' }}>
          <div className="flex items-center gap-3 mb-6">
            <Palette size={18} style={{ color: '#775A19' }} />
            <span style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19' }}>Color Palette</span>
          </div>
          <div className="flex gap-4">
            {brandColors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-xl" style={{ background: color, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                <span style={{ fontFamily: sans, fontSize: 10, color: '#78716C', textTransform: 'uppercase' }}>{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="p-8 rounded-lg" style={{ background: '#F6F3F2' }}>
          <div className="flex items-center gap-3 mb-6">
            <Type size={18} style={{ color: '#775A19' }} />
            <span style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19' }}>Typography</span>
          </div>
          <div className="mb-4">
            <div style={{ fontFamily: nimbus, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.9, color: '#78716C', marginBottom: 4 }}>Heading Font</div>
            <div style={{ fontFamily: serif, fontSize: 28, color: '#1C1B1B' }}>{brandFont}</div>
          </div>
          <div>
            <div style={{ fontFamily: nimbus, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.9, color: '#78716C', marginBottom: 4 }}>Body Font</div>
            <div style={{ fontFamily: sans, fontSize: 18, color: '#1C1B1B' }}>Manrope</div>
          </div>
          <p style={{ fontFamily: sans, fontSize: 13, color: '#78716C', lineHeight: '20px', marginTop: 16 }}>
            The quick brown fox jumps over the lazy dog. Aa Bb Cc 123
          </p>
        </div>
      </div>
    </>
  )
}

/* ─── Section: Campaigns ─── */
function CampaignsContent({ navigate, campaigns }) {
  const statusColor = { Active: '#22C55E', Draft: '#A8A29E', Scheduled: '#C5A059', Completed: '#78716C' }
  const data = campaigns || []

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <SectionTitle title="Campaigns" subtitle="Manage all your campaigns" />
        <button onClick={() => navigate('/campaign/create')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
          style={{ background: '#775A19', color: 'white', fontFamily: sans, fontSize: 12, fontWeight: 600 }}>
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['All', 'Active', 'Draft', 'Scheduled', 'Completed'].map((filter, i) => (
          <button key={filter} className="px-4 py-2 rounded-lg cursor-pointer transition-colors"
            style={{ background: i === 0 ? 'rgba(119,90,25,0.10)' : 'white', fontFamily: sans, fontSize: 11, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#775A19' : '#78716C', border: '1px solid rgba(209,197,180,0.15)' }}>
            {filter}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-lg" style={{ background: '#F6F3F2' }}>
          <Megaphone size={32} style={{ color: '#A8A29E', marginBottom: 12 }} />
          <div style={{ fontFamily: serif, fontSize: 18, color: '#1C1B1B', marginBottom: 4 }}>No campaigns yet</div>
          <div style={{ fontFamily: sans, fontSize: 13, color: '#78716C', marginBottom: 16 }}>Create your first campaign to get started</div>
          <button onClick={() => navigate('/campaign/create')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: '#775A19', color: 'white', fontFamily: sans, fontSize: 12, fontWeight: 600 }}>
            <Plus size={16} /> Create Campaign
          </button>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(209,197,180,0.20)' }}>
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3" style={{ background: '#F6F3F2' }}>
            {['Campaign', 'Status', 'Platform', 'Date', 'Impressions', 'Conversions'].map((h, i) => (
              <div key={h} className={i === 0 ? 'col-span-4' : 'col-span-2'} style={{ fontFamily: nimbus, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: '#78716C' }}>
                {h}
              </div>
            ))}
          </div>
          {/* Rows */}
          {data.map(c => (
            <div key={c.id} onClick={() => navigate('/campaign/editor')} className="grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer hover:bg-stone-50 transition-colors" style={{ borderTop: '1px solid rgba(209,197,180,0.12)' }}>
              <div className="col-span-4 flex items-center gap-3">
                <span style={{ fontFamily: serif, fontSize: 14, color: '#1C1B1B' }}>{c.title}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: statusColor[c.status] || '#A8A29E' }} />
                <span style={{ fontFamily: sans, fontSize: 12, color: '#1C1B1B' }}>{c.status}</span>
              </div>
              <div className="col-span-2" style={{ fontFamily: sans, fontSize: 12, color: '#78716C' }}>{c.platform}</div>
              <div className="col-span-2" style={{ fontFamily: sans, fontSize: 12, color: '#78716C' }}>{c.date}</div>
              <div className="col-span-1" style={{ fontFamily: sans, fontSize: 12, color: '#1C1B1B', fontWeight: 500 }}>{c.impressions || '—'}</div>
              <div className="col-span-1" style={{ fontFamily: sans, fontSize: 12, color: c.conversions && c.conversions !== '—' ? '#775A19' : '#78716C', fontWeight: 500 }}>{c.conversions || '—'}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ─── Section: Insights ─── */
function InsightsContent({ stats }) {
  const topMetrics = [
    { label: 'Total Reach', value: stats?.totalReach ?? 0, change: '—' },
    { label: 'Engagement Rate', value: stats?.avgEngagement ?? '0%', change: '—' },
    { label: 'Conversions', value: stats?.totalConversions ?? '0%', change: '—' },
    { label: 'Revenue', value: stats?.revenue ?? '$0', change: '—' },
  ]

  return (
    <>
      <SectionTitle title="Insights" subtitle="Performance analytics & trends" />

      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {topMetrics.map(m => (
          <div key={m.label} className="p-6 rounded-lg" style={{ background: '#F6F3F2' }}>
            <div style={{ fontFamily: nimbus, fontSize: 9, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 0.9, color: '#78716C' }}>{m.label}</div>
            <div className="flex items-end gap-3 mt-2">
              <span style={{ fontFamily: serif, fontSize: 28, fontWeight: 400, color: '#1C1B1B' }}>{m.value}</span>
              <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: '#775A19', marginBottom: 4 }}>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Channel Performance */}
      <div className="p-8 rounded-lg mb-8" style={{ background: '#F6F3F2' }}>
        <div className="flex items-center gap-3 mb-6">
          <span style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19' }}>Channel Performance</span>
        </div>
        <div className="flex flex-col items-center justify-center py-10">
          <div style={{ fontFamily: sans, fontSize: 13, color: '#78716C' }}>No channel data available yet</div>
        </div>
      </div>

      {/* Trend Summary */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-8 rounded-lg" style={{ background: '#F6F3F2' }}>
          <div style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19', marginBottom: 16 }}>Top Performing Content</div>
          <div className="flex flex-col items-center justify-center py-6">
            <div style={{ fontFamily: sans, fontSize: 13, color: '#78716C' }}>No campaign data yet</div>
          </div>
        </div>
        <div className="p-8 rounded-lg" style={{ background: '#F6F3F2' }}>
          <div style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19', marginBottom: 16 }}>AI Recommendations</div>
          <div className="flex flex-col items-center justify-center py-6">
            <div style={{ fontFamily: sans, fontSize: 13, color: '#78716C' }}>Create campaigns to get AI recommendations</div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Section: Studio ─── */
function StudioContent({ navigate }) {
  const templates = [
    { title: 'Instagram Grid Post', size: '1080 × 1080', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop' },
    { title: 'Story / Reel Cover', size: '1080 × 1920', image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=300&h=500&fit=crop' },
    { title: 'Email Header', size: '600 × 200', image: 'https://images.unsplash.com/photo-1623998021446-45cd9b269c95?w=600&h=200&fit=crop' },
    { title: 'Billboard', size: '1920 × 1080', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=225&fit=crop' },
  ]

  return (
    <>
      <SectionTitle title="Studio" subtitle="Create & edit campaign visuals" />

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-5 mb-10">
        {[
          { icon: Image, label: 'Generate Visual', desc: 'AI-powered image creation' },
          { icon: FileText, label: 'Write Copy', desc: 'Generate campaign text' },
          { icon: Layers, label: 'Create Layout', desc: 'Design from templates' },
        ].map(action => (
          <button key={action.label} onClick={() => navigate('/campaign/create')}
            className="p-6 rounded-lg flex items-start gap-4 cursor-pointer transition-colors hover:bg-stone-100 text-left"
            style={{ background: '#F6F3F2', border: '1px solid rgba(209,197,180,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(119,90,25,0.08)' }}>
              <action.icon size={18} style={{ color: '#775A19' }} />
            </div>
            <div>
              <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 600, color: '#1C1B1B' }}>{action.label}</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: '#78716C', marginTop: 2 }}>{action.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Templates */}
      <div className="flex items-center justify-between mb-6">
        <span style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19' }}>Templates</span>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {templates.map(t => (
          <div key={t.title} onClick={() => navigate('/campaign/create')} className="rounded-lg overflow-hidden cursor-pointer group" style={{ background: '#F6F3F2' }}>
            <div className="overflow-hidden">
              <img src={t.image} alt={t.title} className="w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <div style={{ fontFamily: serif, fontSize: 14, color: '#1C1B1B' }}>{t.title}</div>
              <div style={{ fontFamily: nimbus, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.9, color: '#78716C', marginTop: 4 }}>{t.size}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── Main Dashboard ─── */
export default function Dashboard({ user, brand, onLogout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('monthly')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.access_token) return
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard`, {
          headers: { 'Authorization': `Bearer ${user.access_token}` },
        })
        const data = await res.json()
        if (data.success) setDashboardData(data)
      } catch {
        // fallback to hardcoded data
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [user?.access_token])

  const PAGE_TITLES = {
    dashboard: { title: 'Good morning, Atelier.', subtitle: "Curating your brand's digital legacy." },
    'brand-identity': { title: 'Brand Identity', subtitle: 'Define and manage your visual DNA.' },
    campaigns: { title: 'Campaigns', subtitle: 'Create, schedule, and manage campaigns.' },
    insights: { title: 'Insights', subtitle: 'Understand your performance at a glance.' },
    studio: { title: 'Studio', subtitle: 'Design stunning campaign visuals.' },
  }

  const current = PAGE_TITLES[activeSection]

  return (
    <div className="flex min-h-screen" style={{ background: '#FFFFFF' }}>
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 flex flex-col justify-between border-r" style={{ borderColor: 'rgba(209,197,180,0.2)', background: '#FAFAF9' }}>
        <div>
          <div className="px-6 pt-8 pb-8">
            <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, color: '#1C1B1B' }}>L'Atelier</div>
            <div style={{ fontFamily: sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, color: '#A8A29E', marginTop: 2 }}>Marketing Suite</div>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map(item => (
              <button key={item.key} onClick={() => item.key === 'ai-chat' ? navigate('/chat') : setActiveSection(item.key)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-left w-full transition-colors cursor-pointer"
                style={{
                  background: activeSection === item.key ? 'rgba(119,90,25,0.06)' : 'transparent',
                  color: activeSection === item.key ? '#775A19' : '#78716C',
                  fontFamily: sans, fontSize: 13, fontWeight: activeSection === item.key ? 600 : 400,
                }}>
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="px-3 pb-6">
          <button onClick={() => navigate('/campaign/create')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl mb-6 cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: '#775A19', color: 'white', fontFamily: sans, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            New Campaign
          </button>
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-left w-full cursor-pointer" style={{ color: '#A8A29E', fontFamily: sans, fontSize: 13 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Support
            </button>
            <button onClick={onLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-left w-full cursor-pointer" style={{ color: '#A8A29E', fontFamily: sans, fontSize: 13 }}>
              <LogOut size={16} />
              Account
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-10 pt-8 pb-6">
          <div>
            <h1 style={{ fontFamily: serif, fontSize: 32, fontWeight: 400, color: '#1C1B1B', lineHeight: 1.2 }}>{current.title}</h1>
            <p style={{ fontFamily: sans, fontSize: 14, color: '#A8A29E', marginTop: 4 }}>{current.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl transition-colors cursor-pointer" style={{ color: '#A8A29E' }}><Bell size={20} /></button>
            <button className="p-2.5 rounded-xl transition-colors cursor-pointer" style={{ color: '#A8A29E' }}><Settings size={20} /></button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#C5A059' }}>
              <span style={{ color: 'white', fontFamily: sans, fontSize: 14, fontWeight: 600 }}>{brand?.storeName?.[0] || 'A'}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-10 pb-10">
          {activeSection === 'dashboard' && <DashboardContent navigate={navigate} activeTab={activeTab} setActiveTab={setActiveTab} stats={dashboardData?.stats} analytics={dashboardData?.analytics} campaigns={dashboardData?.campaigns} />}
          {activeSection === 'brand-identity' && <BrandIdentityContent brand={dashboardData?.brand || brand} />}
          {activeSection === 'campaigns' && <CampaignsContent navigate={navigate} campaigns={dashboardData?.campaigns} />}
          {activeSection === 'insights' && <InsightsContent stats={dashboardData?.stats} />}
          {activeSection === 'studio' && <StudioContent navigate={navigate} />}
        </div>

        {/* Footer Status */}
        <div className="px-10 pb-6">
          <div className="flex items-center justify-between pt-6" style={{ borderTop: '1px solid rgba(209,197,180,0.15)' }}>
            <div className="flex items-center gap-10">
              <div>
                <div style={{ fontFamily: nimbus, fontSize: 9, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 0.9, color: '#78716C' }}>Status</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
                  <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 500, color: '#775A19' }}>AI Engine Ready</span>
                </div>
              </div>
              <div>
                <div style={{ fontFamily: nimbus, fontSize: 9, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 0.9, color: '#78716C' }}>Last Update</div>
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 400, color: '#78716C', marginTop: 4, display: 'block' }}>12 mins ago</span>
              </div>
            </div>
            <div style={{ fontFamily: serif, fontSize: 13, fontWeight: 400, fontStyle: 'italic', color: '#D1C5B4' }}>"True luxury is found in the details."</div>
          </div>
        </div>
      </main>
    </div>
  )
}
