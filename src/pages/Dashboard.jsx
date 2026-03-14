import { useNavigate } from 'react-router-dom'
import { Plus, TrendingUp, Eye, ChevronLeft, ChevronRight, Calendar, Clock, Instagram, Facebook, Settings, MessageCircle, LogOut, Sparkles } from 'lucide-react'
import { useState, useRef } from 'react'

const SAMPLE_CAMPAIGNS = [
  {
    id: 1,
    title: 'New store opening at New York for Instagram and Facebook',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    date: 'Aug 23, 2025',
    time: '03:00 PM',
    platforms: ['instagram', 'facebook'],
  },
  {
    id: 2,
    title: 'New store opening at New York for Instagram and Facebook',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    date: 'Aug 23, 2025',
    time: '03:00 PM',
    platforms: ['instagram', 'facebook'],
  },
  {
    id: 3,
    title: 'New store opening at New York for Instagram and Facebook',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    date: 'Aug 23, 2025',
    time: '03:00 PM',
    platforms: ['instagram', 'facebook'],
  },
  {
    id: 4,
    title: 'Summer menu launch campaign for all platforms',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop',
    date: 'Sep 1, 2025',
    time: '10:00 AM',
    platforms: ['instagram', 'facebook'],
  },
]

const LIVE_CAMPAIGNS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop',
    platforms: ['instagram', 'facebook'],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop',
    platforms: ['instagram'],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop',
    platforms: ['facebook'],
  },
]

const PlatformIcon = ({ platform, size = 'w-5 h-5' }) => {
  const icons = {
    instagram: <Instagram className={size} style={{ color: '#E4405F' }} />,
    facebook: <Facebook className={size} style={{ color: '#1877F2' }} />,
    whatsapp: <MessageCircle className={size} style={{ color: '#25D366' }} />,
  }
  return icons[platform] || null
}

export default function Dashboard({ user, brand, onLogout }) {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [scrollPos, setScrollPos] = useState(0)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    const amount = 380
    const newPos = dir === 'left' ? scrollPos - amount : scrollPos + amount
    scrollRef.current.scrollTo({ left: newPos, behavior: 'smooth' })
    setScrollPos(newPos)
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="glass-strong border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-text">Your campaigns</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer">
              <MessageCircle className="w-5 h-5 text-text-secondary" />
            </button>
            <button className="p-2.5 rounded-xl bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer">
              <Settings className="w-5 h-5 text-text-secondary" />
            </button>
            <button
              onClick={() => navigate('/campaign/create')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full gradient-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-soft cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New campaign
            </button>
            <button onClick={onLogout} className="p-2.5 rounded-xl bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer" title="Logout">
              <LogOut className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="glass-strong rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="text-text-secondary font-medium">Sales</span>
            </div>
            <div className="text-4xl font-bold text-text mb-2">$23,500</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> 30%
              </span>
              <span className="text-sm text-text-secondary">vs Dec 2024</span>
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-text-secondary font-medium">Views</span>
            </div>
            <div className="text-4xl font-bold text-text mb-2">234,000</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> 30%
              </span>
              <span className="text-sm text-text-secondary">vs Dec 2024</span>
            </div>
          </div>
        </div>

        {/* Upcoming Scheduled Campaigns */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-text">Upcoming scheduled campaigns</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4 text-text-secondary" />
              </button>
              <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
            {SAMPLE_CAMPAIGNS.map(campaign => (
              <div
                key={campaign.id}
                onClick={() => navigate('/campaign/editor', { state: { campaign } })}
                className="flex-shrink-0 w-[340px] glass-strong rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all cursor-pointer group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {campaign.platforms.map(p => (
                      <div key={p} className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                        <PlatformIcon platform={p} size="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-text leading-snug mb-3">{campaign.title}</p>
                  <div className="flex items-center gap-2 text-text-secondary text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{campaign.date}</span>
                    <Clock className="w-3.5 h-3.5 ml-2" />
                    <span>{campaign.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Campaigns */}
        <div>
          <h2 className="text-lg font-semibold text-text mb-5">Live campaigns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LIVE_CAMPAIGNS.map(campaign => (
              <div
                key={campaign.id}
                onClick={() => navigate('/campaign/editor', { state: { campaign } })}
                className="glass-strong rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all cursor-pointer group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={campaign.image} alt="Campaign" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {campaign.platforms.map(p => (
                      <div key={p} className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                        <PlatformIcon platform={p} size="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium">
                    Live
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
