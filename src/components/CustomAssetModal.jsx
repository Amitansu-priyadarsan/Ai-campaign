import { useState, useRef } from 'react'
import { X, Upload } from 'lucide-react'

const serif = "'Noto Serif', serif"
const sans = 'Manrope, sans-serif'

export default function CustomAssetModal({
  open,
  title,
  showImage = true,
  imageRequired = false,
  onClose,
  onSave, // ({ label, image }) => Promise
}) {
  const fileRef = useRef(null)
  const [label, setLabel] = useState('')
  const [image, setImage] = useState(null) // { url, dataUrl }
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  if (!open) return null

  const reset = () => { setLabel(''); setImage(null); setErr(null); setSaving(false) }
  const close = () => { reset(); onClose?.() }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage({ url: URL.createObjectURL(file), dataUrl: reader.result })
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setErr(null)
    if (!label.trim()) { setErr('Please enter a name.'); return }
    if (imageRequired && !image) { setErr('Please upload an image.'); return }
    setSaving(true)
    try {
      await onSave({ label: label.trim(), image: image?.dataUrl || null })
      close()
    } catch (e) {
      setErr(e.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" style={{ background: 'rgba(28,27,27,0.50)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full sm:max-w-[480px]" style={{ background: 'white', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div style={{ fontFamily: serif, fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 400, color: '#1C1B1B' }}>{title}</div>
          <button onClick={close} className="cursor-pointer" style={{ color: '#7F7667' }}><X size={18} /></button>
        </div>

        <label style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>Name</label>
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g. Mysore Silk Royal Blue"
          className="w-full mt-2 mb-5 px-4 py-3 rounded-lg outline-none"
          style={{ background: '#F0EDED', fontFamily: sans, fontSize: 14, color: '#1C1B1B' }}
        />

        {showImage && (
          <>
            <label style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7F7667' }}>
              {imageRequired ? 'Reference Image' : 'Reference Image (optional)'}
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="mt-2 flex items-center justify-center rounded-lg cursor-pointer overflow-hidden"
              style={{ background: '#F6F3F2', outline: '2px dashed rgba(209,197,180,0.40)', outlineOffset: -2, height: 200 }}
            >
              {image ? (
                <img src={image.url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  <Upload size={24} style={{ color: '#D1C5B4' }} />
                  <div className="mt-2" style={{ fontFamily: sans, fontSize: 12, color: '#7F7667' }}>Click to upload</div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </>
        )}

        {err && <div className="mt-4" style={{ fontFamily: sans, fontSize: 12, color: '#dc2626' }}>{err}</div>}

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={close} className="px-5 py-3 rounded-lg cursor-pointer" style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#5F5E5E' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-3 rounded-lg cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: '#775A19', color: 'white', fontFamily: sans, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: saving ? 0.5 : 1 }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
