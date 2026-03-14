import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Instagram, Facebook, ChevronDown, Heart, MessageCircle, Send, Bookmark, RefreshCw, Sparkles, Copy, Settings, Wand2 } from 'lucide-react'
import PublishModal from '../components/PublishModal'

const DEFAULT_CAMPAIGN = {
  title: 'Baithak Seattle',
  description: "You're invited to our new restaurant opening at Ballards Avenue, Seattle, on Sep 16, 2025 from 08:00 PM",
  image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop',
  caption: 'Join us in our new restaurant in Seattle #newrestaurant #nyetime #seattletimes #restaurant #indiancuisine #asiancuisine #indian #asian',
  brandName: 'Baithak',
  brandSubtitle: 'Kebab & Curry',
  items: [
    { name: 'Penne pasta', desc: 'Al dente penne that soaks up', price: '$11.99', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop' },
    { name: 'Fried Chicken', desc: 'Crunch outside, succulent', price: '$5.99', image: 'https://images.unsplash.com/photo-1626645738196-c2a98d2c3b89?w=200&h=200&fit=crop' },
  ],
}

export default function CampaignEditor({ brand }) {
  const navigate = useNavigate()
  const location = useLocation()
  const campaign = location.state?.campaign || DEFAULT_CAMPAIGN
  const [showPublish, setShowPublish] = useState(false)
  const [previewPlatform, setPreviewPlatform] = useState('instagram')
  const [followUpPrompt, setFollowUpPrompt] = useState('')
  const [campaignName, setCampaignName] = useState('Campaign name')
  const [published, setPublished] = useState(false)

  const handlePublish = (config) => {
    setPublished(true)
    setTimeout(() => {
      navigate('/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="glass-strong border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/60 transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="text-lg font-semibold text-text bg-transparent border-none outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Platform preview selector */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-border text-sm font-medium text-text-secondary cursor-pointer">
              Preview for
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                <Instagram className="w-3 h-3 text-white" />
              </div>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <button className="p-2.5 rounded-xl bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer">
              <Settings className="w-5 h-5 text-text-secondary" />
            </button>
            <button className="p-2.5 rounded-xl bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer">
              <Copy className="w-5 h-5 text-text-secondary" />
            </button>
            <button className="p-2.5 rounded-xl bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer">
              <Wand2 className="w-5 h-5 text-text-secondary" />
            </button>

            <button
              onClick={() => setShowPublish(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full gradient-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-soft cursor-pointer"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Side action buttons */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          <button className="p-3 rounded-full glass shadow-soft hover:shadow-card transition-all cursor-pointer">
            <RefreshCw className="w-5 h-5 text-text-secondary" />
          </button>
          <button className="p-3 rounded-full glass shadow-soft hover:shadow-card transition-all cursor-pointer">
            <Sparkles className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Instagram Preview Card */}
        <div className="max-w-lg mx-auto">
          <div className="glass-strong rounded-3xl overflow-hidden shadow-card">
            {/* Post header */}
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                B
              </div>
              <div>
                <span className="text-sm font-semibold text-text flex items-center gap-1">
                  {campaign.brandName || 'Baithak'}
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Campaign Image */}
            <div className="relative aspect-square bg-gray-900">
              <img
                src={campaign.image || DEFAULT_CAMPAIGN.image}
                alt="Campaign"
                className="w-full h-full object-cover"
              />
              {/* Overlay content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 flex flex-col justify-between p-6">
                <div className="text-center">
                  <h3 className="text-white text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                    {campaign.brandName || 'Baithak'}
                  </h3>
                  <p className="text-white/70 text-xs">{campaign.brandSubtitle || 'Kebab & Curry'}</p>
                </div>

                <div className="text-center">
                  <h2 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {campaign.title || 'Baithak Seattle'}
                  </h2>
                  <p className="text-white/80 text-sm">{campaign.description || DEFAULT_CAMPAIGN.description}</p>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
                <Sparkles className="w-4 h-4 text-white/70" />
                <span className="text-white/80 text-xs">Circle or draw anywhere over the template to edit highlighted elements</span>
              </div>
            </div>

            {/* Action bar */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <Heart className="w-6 h-6 text-text cursor-pointer hover:text-red-500 transition-colors" />
                  <MessageCircle className="w-6 h-6 text-text cursor-pointer" />
                  <Send className="w-6 h-6 text-text cursor-pointer" />
                </div>
                <Bookmark className="w-6 h-6 text-text cursor-pointer" />
              </div>

              <div className="text-sm">
                <span className="font-semibold text-text">baithakofficial</span>
                <span className="text-text-secondary ml-2">{campaign.caption || DEFAULT_CAMPAIGN.caption}</span>
              </div>
            </div>
          </div>

          {/* Follow up prompt */}
          <div className="mt-8">
            <div className="glass-strong rounded-2xl p-4 shadow-soft border-2 border-primary/20">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-primary/50 flex-shrink-0" />
                <input
                  type="text"
                  value={followUpPrompt}
                  onChange={(e) => setFollowUpPrompt(e.target.value)}
                  placeholder="Follow up with what you want or draw anywhere over the template"
                  className="flex-1 bg-transparent outline-none text-sm text-text placeholder:text-text-secondary/50"
                />
                <button className="p-2.5 rounded-full gradient-primary text-white cursor-pointer hover:opacity-90 transition-opacity">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-center text-xs text-text-secondary mt-3">A clear, concise prompt always generates the best result</p>
          </div>
        </div>
      </div>

      {/* Published success overlay */}
      {published && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="glass-strong rounded-3xl p-10 shadow-card text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Campaign Published!</h3>
            <p className="text-text-secondary">Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublish && <PublishModal onClose={() => setShowPublish(false)} onPublish={handlePublish} />}
    </div>
  )
}
