'use client'

import { useState } from 'react'
import AISelector from '@/components/AISelector'
import ResponseCard, { AIResponse } from '@/components/ResponseCard'
import DownloadPanel from '@/components/DownloadPanel'

const FORMATS = ['md', 'txt', 'json'] as const
type Format = typeof FORMATS[number]

export default function Home() {
  const [projectName, setProjectName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selectedAIs, setSelectedAIs] = useState<string[]>(['openai', 'anthropic', 'grok'])
  const [format, setFormat] = useState<Format>('md')
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<AIResponse[]>([])
  const [error, setError] = useState('')

  const dispatch = async () => {
    if (!prompt.trim() || selectedAIs.length === 0) return
    setLoading(true)
    setError('')
    setResponses([])

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, projectName, ais: selectedAIs, format }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setResponses(data.responses)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10 border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">Multi-AI Hub</h1>
          <p className="text-gray-400 mt-1">Dispatch one prompt to ChatGPT, Claude, and Grok — download every response as a file</p>
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="my-app, chapter-one, research-topic..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={9}
              placeholder="Describe what you want all AIs to work on. Be specific — include context about the project, the goal, and the type of output you want..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
            />
          </div>

          <AISelector selected={selectedAIs} onChange={setSelectedAIs} />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Output Format</label>
            <div className="flex gap-2">
              {FORMATS.map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-2 rounded-lg font-mono text-sm border transition-colors ${
                    format === f
                      ? 'bg-indigo-700 border-indigo-500 text-white'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  .{f}
                </button>
              ))}
              <span className="ml-2 self-center text-xs text-gray-600">
                {format === 'md' && 'Markdown — best for pasting into AI chats'}
                {format === 'txt' && 'Plain text — universal, easy to read'}
                {format === 'json' && 'JSON — structured, good for processing'}
              </span>
            </div>
          </div>

          <button
            onClick={dispatch}
            disabled={loading || !prompt.trim() || selectedAIs.length === 0}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors text-sm tracking-wide"
          >
            {loading
              ? `Dispatching to ${selectedAIs.length} AI${selectedAIs.length !== 1 ? 's' : ''}...`
              : `Dispatch to ${selectedAIs.length} AI${selectedAIs.length !== 1 ? 's' : ''}`}
          </button>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="mt-10 space-y-4">
            {selectedAIs.map(ai => (
              <div key={ai} className="rounded-lg border border-gray-800 bg-gray-900 p-4 animate-pulse">
                <div className="h-4 bg-gray-800 rounded w-24 mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-800 rounded w-4/5" />
                  <div className="h-3 bg-gray-800 rounded w-3/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Responses */}
        {!loading && responses.length > 0 && (
          <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Responses <span className="text-gray-500 font-normal text-sm">— drag these files into any AI chat as context</span>
              </h2>
              <DownloadPanel responses={responses} projectName={projectName} />
            </div>
            {responses.map(r => (
              <ResponseCard key={r.ai} response={r} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
