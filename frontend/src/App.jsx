import { useState } from 'react'
import Logo from './components/Logo.jsx'

const API_URL = '/api/parse'

export default function App() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || '请求失败')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-gray-100 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            如意 Ruyi AI
          </h1>
          <p className="text-gray-400 mt-2">说出你想做的事，AI 帮你拆解目标</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如：帮我做一份本周工作总结"
            className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-5 py-3.5 focus:outline-none focus:border-indigo-500 transition-colors text-gray-100"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-all active:scale-95"
          >
            {loading ? '分析中...' : '开始'}
          </button>
        </form>

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">正在拆解您的需求...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎯</span>
              <h2 className="text-xl font-semibold text-indigo-300">{result.goal}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-500 uppercase tracking-wider">交付物</span>
                <p className="mt-1 text-gray-200">{result.deliverable.type} ({result.deliverable.format})</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-500 uppercase tracking-wider">置信度</span>
                <p className="mt-1 text-emerald-400 font-mono font-bold">{(result.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">执行步骤</span>
              <ul className="space-y-2">
                {result.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-300 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {result.note && (
              <p className="text-sm text-gray-400 italic border-t border-gray-800 pt-4 mt-4">
                💡 {result.note}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
