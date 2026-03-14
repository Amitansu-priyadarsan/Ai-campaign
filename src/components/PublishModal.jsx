import { useState } from 'react'
import { X, Send, Clock, Check, Instagram, Facebook, MessageCircle, Mail, MessageSquare } from 'lucide-react'

const CHANNELS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
  { id: 'email', name: 'Email', icon: Mail, color: '#6366f1' },
  { id: 'sms', name: 'SMS', icon: MessageSquare, color: '#8B5CF6' },
]

export default function PublishModal({ onClose, onPublish }) {
  const [selectedChannels, setSelectedChannels] = useState(['instagram', 'facebook', 'whatsapp', 'email', 'sms'])
  const [mode, setMode] = useState('later') // 'now' | 'later'
  const [date, setDate] = useState('2025-10-08')
  const [time, setTime] = useState('10:15')

  const toggleChannel = (id) => {
    setSelectedChannels(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleConfirm = () => {
    onPublish({
      channels: selectedChannels,
      mode,
      date: mode === 'later' ? date : null,
      time: mode === 'later' ? time : null,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-strong rounded-3xl shadow-card p-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/60 transition-colors cursor-pointer">
          <X className="w-5 h-5 text-text-secondary" />
        </button>

        <h2 className="text-2xl font-bold text-text mb-6">Publish your campaign</h2>

        {/* Channels */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Channels</h3>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map(ch => (
              <button
                key={ch.id}
                onClick={() => toggleChannel(ch.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                  selectedChannels.includes(ch.id)
                    ? 'border-primary bg-primary/5 text-text'
                    : 'border-border text-text-secondary hover:border-primary/30'
                }`}
              >
                <ch.icon className="w-4 h-4" style={{ color: ch.color }} />
                {ch.name}
                {selectedChannels.includes(ch.id) && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Publish timing */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Publish at</h3>
          <div className="flex rounded-xl bg-white/60 border border-border p-1 mb-4">
            <button
              onClick={() => setMode('now')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                mode === 'now' ? 'bg-white shadow-soft text-text' : 'text-text-secondary'
              }`}
            >
              <Send className="w-4 h-4" /> Publish now
            </button>
            <button
              onClick={() => setMode('later')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                mode === 'later' ? 'gradient-primary text-white shadow-soft' : 'text-text-secondary'
              }`}
            >
              <Clock className="w-4 h-4" /> Schedule for later
            </button>
          </div>

          {mode === 'later' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white/60 text-text focus:outline-none focus:border-primary input-glow transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white/60 text-text focus:outline-none focus:border-primary input-glow transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border border-border text-text-secondary font-medium hover:bg-white/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedChannels.length === 0}
            className="flex-1 py-3.5 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer shadow-soft"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
