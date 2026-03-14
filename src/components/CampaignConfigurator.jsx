import { useState } from 'react'
import { X, Upload, Plus, HelpCircle } from 'lucide-react'

const ASPECT_RATIOS = ['1:1', '9:16', '16:9']

const COLOR_TONES = [
  { id: 'warm', label: 'Warm', gradient: 'from-red-400 to-orange-400' },
  { id: 'cool', label: 'Cool', gradient: 'from-blue-500 to-indigo-600' },
  { id: 'vibrant', label: 'Vibrant', gradient: 'from-green-400 to-cyan-400' },
  { id: 'monochrome', label: 'Monochrome', gradient: 'from-gray-500 to-gray-700' },
]

const VISUAL_STYLES = [
  { id: 'cartoon', label: 'Cartoon', image: 'https://images.unsplash.com/photo-1620336655052-b57986f5a26a?w=100&h=100&fit=crop' },
  { id: 'anime', label: 'Anime', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&h=100&fit=crop' },
  { id: 'realistic', label: 'Realistic', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 'cinematic', label: 'Cinematic', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
]

const SOUNDS = [
  { id: 'none', label: 'No music', icon: '🚫' },
  { id: 'live', label: 'Live dub', icon: '🎙️' },
  { id: 'background', label: 'Background music', icon: '🎵' },
  { id: 'voiceover', label: 'Voice-over', icon: '🗣️' },
]

export default function CampaignConfigurator({ onClose, brand }) {
  const [tab, setTab] = useState('brand')
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(brand?.logoPreview || null)
  const [colorPalettes, setColorPalettes] = useState([])
  const [brandKitImages, setBrandKitImages] = useState([])

  // Video settings
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [colorTone, setColorTone] = useState('warm')
  const [visualStyle, setVisualStyle] = useState('cartoon')
  const [sound, setSound] = useState('none')

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleBrandKitUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.slice(0, 5 - brandKitImages.length).map(f => ({
      file: f,
      preview: URL.createObjectURL(f)
    }))
    setBrandKitImages(prev => [...prev, ...newImages].slice(0, 5))
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-strong shadow-card overflow-y-auto animate-in slide-in-from-right">
        <div className="sticky top-0 glass-strong z-10 p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text">Campaign Configurator</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/60 transition-colors cursor-pointer">
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-white/60 border border-border p-1">
            <button
              onClick={() => setTab('brand')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === 'brand' ? 'gradient-primary text-white shadow-soft' : 'text-text-secondary hover:text-text'
              }`}
            >
              Brand Configuration
            </button>
            <button
              onClick={() => setTab('video')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === 'video' ? 'gradient-primary text-white shadow-soft' : 'text-text-secondary hover:text-text'
              }`}
            >
              Video Settings
            </button>
          </div>
        </div>

        <div className="p-6">
          {tab === 'brand' ? (
            <div className="space-y-8">
              {/* Logo upload */}
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Your logo</h3>
                <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-white/40">
                  <div className="w-14 h-14 rounded-xl bg-white/80 border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-5 h-5 text-text-secondary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-text">Drop an image or <span className="font-bold">browse files</span></p>
                    <p className="text-xs text-text-secondary mt-0.5">Recommended image dimension 1:1</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                <p className="text-xs text-text-secondary mt-2">up to 10 MB &middot; formats supported .jpg, .jpeg, .png</p>
              </div>

              {/* Color palette */}
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Color palette</h3>
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-primary text-sm font-medium transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> New palette
                </button>
              </div>

              {/* Brand Kit Images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-text">Brand Kit Images</h3>
                    <HelpCircle className="w-4 h-4 text-text-secondary" />
                  </div>
                  <span className="text-xs text-text-secondary">max 5 images</span>
                </div>
                <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-white/40">
                  <div className="w-14 h-14 rounded-xl bg-white/80 border border-border flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-text">Drop an image or <span className="font-bold">browse files</span></p>
                    <p className="text-xs text-text-secondary mt-0.5">Recommended image dimension 1:1</p>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleBrandKitUpload} className="hidden" />
                </label>
                <p className="text-xs text-text-secondary mt-2">up to 5 MB &middot; formats supported .jpg, .jpeg, .png</p>

                {brandKitImages.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {brandKitImages.map((img, i) => (
                      <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-border">
                        <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Aspect Ratio */}
              <div>
                <div className="flex gap-3">
                  {ASPECT_RATIOS.map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                        aspectRatio === ratio ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary hover:border-primary/30'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Tone */}
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Color Tone</h3>
                <div className="grid grid-cols-4 gap-3">
                  {COLOR_TONES.map(tone => (
                    <button
                      key={tone.id}
                      onClick={() => setColorTone(tone.id)}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tone.gradient} transition-all ${
                        colorTone === tone.id ? 'ring-3 ring-primary ring-offset-2 scale-105' : 'group-hover:scale-105'
                      }`} />
                      <span className={`text-xs font-medium ${colorTone === tone.id ? 'text-primary' : 'text-text-secondary'}`}>{tone.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Style */}
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Visual Style</h3>
                <div className="grid grid-cols-4 gap-3">
                  {VISUAL_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setVisualStyle(style.id)}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className={`w-16 h-16 rounded-2xl overflow-hidden transition-all ${
                        visualStyle === style.id ? 'ring-3 ring-primary ring-offset-2 scale-105' : 'group-hover:scale-105'
                      }`}>
                        <img src={style.image} alt={style.label} className="w-full h-full object-cover" />
                      </div>
                      <span className={`text-xs font-medium ${visualStyle === style.id ? 'text-primary' : 'text-text-secondary'}`}>{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sounds */}
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Sounds</h3>
                <div className="grid grid-cols-4 gap-3">
                  {SOUNDS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSound(s.id)}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-white/60 border-2 flex items-center justify-center text-2xl transition-all ${
                        sound === s.id ? 'border-primary bg-primary/5 scale-105' : 'border-border group-hover:border-primary/30'
                      }`}>
                        {s.icon}
                      </div>
                      <span className={`text-xs font-medium text-center leading-tight ${sound === s.id ? 'text-primary' : 'text-text-secondary'}`}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 glass-strong border-t border-border p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border text-text-secondary font-medium hover:bg-white/60 transition-colors cursor-pointer"
          >
            Discard changes
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-soft"
          >
            Save configuration
          </button>
        </div>
      </div>
    </div>
  )
}
