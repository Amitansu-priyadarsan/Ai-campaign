import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Image, Video, Paperclip, Send, RefreshCw, Check, Play, Settings, MessageCircle } from 'lucide-react'
import CampaignConfigurator from '../components/CampaignConfigurator'

const SUGGESTIONS = [
  'Create a campaign for this week top-selling menu items',
  'Design a festive greeting for the holiday',
  'Generate a Limited Time Offer announcement',
  'Showcase a signature dish from the menu',
]

const GENERATED_CAMPAIGNS = [
  {
    id: 1,
    type: 'image',
    title: 'Penne Pasta Special',
    description: 'Al dente penne that soaks up every drop of our signature sauce',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop',
  },
  {
    id: 2,
    type: 'image',
    title: 'Fried Chicken Combo',
    description: 'Crunch outside, succulent inside — our legendary fried chicken',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a98d2c3b89?w=500&h=500&fit=crop',
  },
  {
    id: 3,
    type: 'video',
    title: 'Restaurant Grand Opening',
    description: 'Experience the grand opening of our newest location',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=500&fit=crop',
  },
  {
    id: 4,
    type: 'image',
    title: 'Weekend Brunch Vibes',
    description: 'Start your weekend right with our signature brunch menu',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop',
  },
]

export default function CampaignCreate({ brand }) {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [imageAI, setImageAI] = useState(true)
  const [videoAI, setVideoAI] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState([])
  const [showConfigurator, setShowConfigurator] = useState(false)

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      setGenerated(GENERATED_CAMPAIGNS)
      setIsGenerating(false)
    }, 2000)
  }

  const handleSuggestionClick = (text) => {
    setPrompt(text)
  }

  const handleSelectCampaign = (campaign) => {
    navigate('/campaign/editor', { state: { campaign } })
  }

  const handleRegenerate = () => {
    setGenerated([])
    setIsGenerating(true)
    setTimeout(() => {
      setGenerated([...GENERATED_CAMPAIGNS].reverse())
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* Header */}
      <div className="glass-strong border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-text">AI Campaigns</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer">
              <MessageCircle className="w-5 h-5 text-text-secondary" />
            </button>
            <button
              onClick={() => setShowConfigurator(true)}
              className="p-2.5 rounded-xl bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed left-6 top-1/2 -translate-y-1/2 p-3 rounded-full glass shadow-soft hover:shadow-card transition-all cursor-pointer z-10"
      >
        <ArrowLeft className="w-5 h-5 text-text-secondary" />
      </button>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero section */}
        {generated.length === 0 && !isGenerating && (
          <>
            {/* Avatar/brand orb */}
            <div className="flex justify-center mb-8">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-pink-300/30 blur-2xl" />
            </div>

            <div className="text-center mb-10 -mt-20">
              <h1 className="text-4xl font-bold text-text mb-3">AI-powered campaigns</h1>
              <p className="text-text-secondary text-lg max-w-lg mx-auto">
                Boost engagement with AI-driven campaigns that optimize targeting, messaging, and performance for maximum impact.
              </p>
            </div>

            {/* Suggestion cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {SUGGESTIONS.slice(0, 3).map((text, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(text)}
                  className="glass-strong rounded-2xl p-5 text-left hover:shadow-card transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-text leading-relaxed">{text}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Generated results */}
        {(generated.length > 0 || isGenerating) && (
          <div className="mb-10">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-text-secondary text-lg">Generating your campaigns...</p>
                <div className="flex gap-1 mt-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text">Generated campaigns</h2>
                  <button
                    onClick={handleRegenerate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-border hover:bg-white/80 transition-colors text-sm font-medium text-text-secondary cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" /> Regenerate
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {generated.map(campaign => (
                    <div key={campaign.id} className="glass-strong rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all group">
                      <div className="relative aspect-square overflow-hidden">
                        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {campaign.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-card">
                              <Play className="w-6 h-6 text-primary ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-text mb-1">{campaign.title}</h3>
                        <p className="text-sm text-text-secondary mb-4">{campaign.description}</p>
                        <button
                          onClick={() => handleSelectCampaign(campaign)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Select campaign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Prompt input */}
        <div className="sticky bottom-6">
          <div className="glass-strong rounded-2xl p-4 shadow-card border-2 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary/50" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Type your campaign brief..."
                className="flex-1 bg-transparent outline-none text-text placeholder:text-text-secondary/50"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setImageAI(true); setVideoAI(false) }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    imageAI ? 'gradient-primary text-white shadow-soft' : 'bg-white/60 text-text-secondary border border-border'
                  }`}
                >
                  <Image className="w-4 h-4" /> Image AI
                </button>
                <button
                  onClick={() => { setVideoAI(true); setImageAI(false) }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    videoAI ? 'gradient-primary text-white shadow-soft' : 'bg-white/60 text-text-secondary border border-border'
                  }`}
                >
                  <Video className="w-4 h-4" /> Video AI
                </button>
                <button className="p-2 rounded-xl bg-white/60 border border-border hover:bg-white/80 transition-colors cursor-pointer">
                  <Paperclip className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="p-3 rounded-xl gradient-primary text-white hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer shadow-soft"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Configurator Sidebar */}
      {showConfigurator && (
        <CampaignConfigurator onClose={() => setShowConfigurator(false)} brand={brand} />
      )}
    </div>
  )
}
