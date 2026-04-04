import { useNavigate } from 'react-router-dom'
import { Plus, Bell, Settings, LogOut, BarChart3, Compass, Megaphone, LineChart, Tv, Upload, Palette, Type, Image, Eye, TrendingUp, Calendar, Clock, Instagram, Facebook, Play, PauseCircle, FileText, Layers, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import Star from '../assets/Star'

const NAV_ITEMS = [
  { icon: BarChart3, label: 'Dashboard', key: 'dashboard' },
  { icon: Compass, label: 'Brand Identity', key: 'brand-identity' },
  { icon: Megaphone, label: 'Campaigns', key: 'campaigns' },
  { icon: LineChart, label: 'Insights', key: 'insights' },
  { icon: Tv, label: 'Studio', key: 'studio' },
  { icon: MessageCircle, label: 'AI Chat', key: 'ai-chat' },
]

const BAR_DATA = [
  { value: 65, label: '12k', opacity: 0.10 },
  { value: 105.63, label: '18k', opacity: 0.15 },
  { value: 89.38, label: '15k', opacity: 0.20 },
  { value: 146.25, label: '24k', opacity: 0.40 },
  { value: 113.75, label: '20k', opacity: 0.25 },
  { value: 195, label: '28.4k', opacity: 1 },
]

const CREATIVES = [
  {
    id: 1,
    title: "L'Eclat Solitaire",
    category: 'Instagram Grid • Active',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop',
  },
  {
    id: 2,
    title: 'Moonlight Tides',
    category: 'Email Editorial • Draft',
    image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=400&h=500&fit=crop',
  },
  {
    id: 3,
    title: 'Chronos Aurum',
    category: 'OOH Billboard • Scheduled',
    image: 'https://images.unsplash.com/photo-1623998021446-45cd9b269c95?w=400&h=500&fit=crop',
  },
]

const CAMPAIGNS_DATA = [
  { id: 1, title: "L'Eclat Solitaire", status: 'Active', platform: 'Instagram Grid', date: 'Mar 15, 2026', impressions: '245K', conversions: '3.2%', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop' },
  { id: 2, title: 'Moonlight Tides', status: 'Draft', platform: 'Email Editorial', date: 'Mar 18, 2026', impressions: '—', conversions: '—', image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=200&h=200&fit=crop' },
  { id: 3, title: 'Chronos Aurum', status: 'Scheduled', platform: 'OOH Billboard', date: 'Mar 25, 2026', impressions: '—', conversions: '—', image: 'https://images.unsplash.com/photo-1623998021446-45cd9b269c95?w=200&h=200&fit=crop' },
  { id: 4, title: 'Aurelia Collection', status: 'Completed', platform: 'Instagram + Facebook', date: 'Feb 28, 2026', impressions: '892K', conversions: '5.1%', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&h=200&fit=crop' },
  { id: 5, title: 'Heritage Line', status: 'Active', platform: 'Multi-channel', date: 'Mar 10, 2026', impressions: '156K', conversions: '2.8%', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop' },
]

const INSIGHTS_DATA = {
  topMetrics: [
    { label: 'Total Reach', value: '3.8M', change: '+18%' },
    { label: 'Engagement Rate', value: '6.2%', change: '+0.8%' },
    { label: 'Click-through Rate', value: '4.1%', change: '+1.2%' },
    { label: 'Revenue Impact', value: '$142K', change: '+24%' },
  ],
  channelPerformance: [
    { channel: 'Instagram', reach: '1.8M', engagement: '7.2%', bar: 85 },
    { channel: 'Facebook', reach: '980K', engagement: '4.8%', bar: 60 },
    { channel: 'Email', reach: '650K', engagement: '8.1%', bar: 72 },
    { channel: 'OOH', reach: '420K', engagement: '2.4%', bar: 35 },
  ],
}

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
function DashboardContent({ navigate, activeTab, setActiveTab }) {
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
            {BAR_DATA.map((bar, i) => (
              <div key={i} className="flex-1 relative flex flex-col items-center">
                {bar.opacity === 1 && <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: '#775A19', marginBottom: 8 }}>{bar.label}</div>}
                <div className="w-full rounded-t-sm" style={{ height: bar.value, background: bar.opacity === 1 ? '#C5A059' : `rgba(119,90,25,${bar.opacity})` }} />
              </div>
            ))}
          </div>
          <div className="flex gap-0 pt-8" style={{ borderTop: '1px solid rgba(209,197,180,0.10)' }}>
            {[{ label: 'Impressions', value: '1.2M', color: '#1C1B1B' }, { label: 'Conversions', value: '4.8%', color: '#1C1B1B' }, { label: 'Brand Lift', value: '+12%', color: '#775A19' }].map(m => (
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

      {/* Recent Creatives */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <SectionTitle title="Recent Creatives" subtitle="Active campaign assets" />
          <button className="cursor-pointer pb-1" style={{ borderBottom: '1px solid rgba(119,90,25,0.20)', fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19' }}>View Library</button>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {CREATIVES.map(c => (
            <div key={c.id} className="flex flex-col cursor-pointer group" onClick={() => navigate('/campaign/editor')}>
              <div className="rounded overflow-hidden" style={{ background: '#F0EDED' }}>
                <img src={c.image} alt={c.title} className="w-full h-[268px] object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="mt-4">
                <div style={{ fontFamily: serif, fontSize: 14, fontWeight: 400, color: '#1C1B1B', lineHeight: '20px' }}>{c.title}</div>
                <div style={{ fontFamily: nimbus, fontSize: 9, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 0.9, color: '#78716C', marginTop: 4 }}>{c.category}</div>
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center rounded cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: '#F6F3F2', outline: '1px solid rgba(209,197,180,0.30)', outlineOffset: -1, minHeight: 268 }}
            onClick={() => navigate('/campaign/create')}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'white', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' }}>
              <Plus size={20} style={{ color: '#775A19' }} />
            </div>
            <div style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#A8A29E' }}>New Creative</div>
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
function CampaignsContent({ navigate }) {
  const statusColor = { Active: '#22C55E', Draft: '#A8A29E', Scheduled: '#C5A059', Completed: '#78716C' }

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

      {/* Campaign Table */}
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
        {CAMPAIGNS_DATA.map(c => (
          <div key={c.id} onClick={() => navigate('/campaign/editor')} className="grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer hover:bg-stone-50 transition-colors" style={{ borderTop: '1px solid rgba(209,197,180,0.12)' }}>
            <div className="col-span-4 flex items-center gap-3">
              <img src={c.image} alt={c.title} className="w-10 h-10 rounded-lg object-cover" />
              <span style={{ fontFamily: serif, fontSize: 14, color: '#1C1B1B' }}>{c.title}</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: statusColor[c.status] }} />
              <span style={{ fontFamily: sans, fontSize: 12, color: '#1C1B1B' }}>{c.status}</span>
            </div>
            <div className="col-span-2" style={{ fontFamily: sans, fontSize: 12, color: '#78716C' }}>{c.platform}</div>
            <div className="col-span-2" style={{ fontFamily: sans, fontSize: 12, color: '#78716C' }}>{c.date}</div>
            <div className="col-span-1" style={{ fontFamily: sans, fontSize: 12, color: '#1C1B1B', fontWeight: 500 }}>{c.impressions}</div>
            <div className="col-span-1" style={{ fontFamily: sans, fontSize: 12, color: c.conversions !== '—' ? '#775A19' : '#78716C', fontWeight: 500 }}>{c.conversions}</div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── Section: Insights ─── */
function InsightsContent() {
  return (
    <>
      <SectionTitle title="Insights" subtitle="Performance analytics & trends" />

      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {INSIGHTS_DATA.topMetrics.map(m => (
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
        <div className="flex flex-col gap-5">
          {INSIGHTS_DATA.channelPerformance.map(ch => (
            <div key={ch.channel} className="flex items-center gap-6">
              <div className="w-24" style={{ fontFamily: sans, fontSize: 13, fontWeight: 500, color: '#1C1B1B' }}>{ch.channel}</div>
              <div className="flex-1 h-6 rounded-sm overflow-hidden" style={{ background: 'rgba(119,90,25,0.06)' }}>
                <div className="h-full rounded-sm transition-all" style={{ width: `${ch.bar}%`, background: 'rgba(119,90,25,0.25)' }} />
              </div>
              <div className="w-20 text-right" style={{ fontFamily: sans, fontSize: 12, color: '#78716C' }}>{ch.reach}</div>
              <div className="w-16 text-right" style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: '#775A19' }}>{ch.engagement}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Summary */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-8 rounded-lg" style={{ background: '#F6F3F2' }}>
          <div style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19', marginBottom: 16 }}>Top Performing Content</div>
          {["L'Eclat Solitaire — 7.8% engagement", "Heritage Line — 6.4% engagement", "Moonlight Tides — 5.9% engagement"].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-3" style={{ borderTop: i > 0 ? '1px solid rgba(209,197,180,0.12)' : 'none' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(119,90,25,0.10)', fontFamily: sans, fontSize: 10, fontWeight: 700, color: '#775A19' }}>{i + 1}</div>
              <span style={{ fontFamily: sans, fontSize: 13, color: '#1C1B1B' }}>{item}</span>
            </div>
          ))}
        </div>
        <div className="p-8 rounded-lg" style={{ background: '#F6F3F2' }}>
          <div style={{ fontFamily: nimbus, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#775A19', marginBottom: 16 }}>AI Recommendations</div>
          {['Increase posting frequency on Instagram Reels — engagement up 34% for video content', 'Schedule campaigns for Tuesday 10am — highest open rates detected', 'Consider OOH for Chronos Aurum — audience overlap with luxury watch segment is 82%'].map((rec, i) => (
            <div key={i} className="flex items-start gap-3 py-3" style={{ borderTop: i > 0 ? '1px solid rgba(209,197,180,0.12)' : 'none' }}>
              <Star />
              <span style={{ fontFamily: sans, fontSize: 13, color: '#1C1B1B', lineHeight: '20px' }}>{rec}</span>
            </div>
          ))}
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
          {activeSection === 'dashboard' && <DashboardContent navigate={navigate} activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeSection === 'brand-identity' && <BrandIdentityContent brand={brand} />}
          {activeSection === 'campaigns' && <CampaignsContent navigate={navigate} />}
          {activeSection === 'insights' && <InsightsContent />}
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
