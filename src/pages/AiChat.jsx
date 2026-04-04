import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AiChat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    const userMsg = message.trim()
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'ai', text: data.reply }])
      } else {
        setMessages((prev) => [...prev, { role: 'error', text: data.detail || 'Something went wrong' }])
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'error', text: 'Cannot reach backend. Is it running on port 8000?' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">AI Chat - API Test</h1>
        <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white">
          Back to Dashboard
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-20">Send a message to test the Gemini API key</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-xl px-4 py-3 max-w-[80%] whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-blue-600 ml-auto'
                : msg.role === 'error'
                ? 'bg-red-900 border border-red-600'
                : 'bg-gray-800'
            }`}
          >
            <p className="text-xs text-gray-400 mb-1 font-semibold">
              {msg.role === 'user' ? 'You' : msg.role === 'error' ? 'Error' : 'Gemini AI'}
            </p>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="bg-gray-800 rounded-xl px-4 py-3 max-w-[80%] animate-pulse">
            <p className="text-gray-400">Thinking...</p>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800 max-w-3xl mx-auto w-full">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 bg-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
