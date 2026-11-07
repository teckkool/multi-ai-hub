'use client'

import { useState, useEffect } from 'react'
import AISelector from '@/components/AISelector'
import ResponseCard, { AIResponse } from '@/components/ResponseCard'
import DownloadPanel from '@/components/DownloadPanel'
import SetupScreen from '@/components/SetupScreen'
import SettingsModal from '@/components/SettingsModal'
import { loadKeys, hasAnyKey, StoredKeys } from '@/lib/keyStore'

const FORMATS = ['md', 'txt', 'json'] as const
type Format = typeof FORMATS[number]

export default function Home() {
  const [keys, setKeys] = useState<StoredKeys | null>(null)
  const [ready, setReady] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const [projectName, setProjectName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selectedAIs, setSelectedAIs] = useState<string[]>(['openai', 'anthropic', 'grok'])
  const [format, setFormat] = useState<Format>('md')
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<AIResponse[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = loadKeys()
    if (hasAnyKey(stored)) {
      setKeys(stored)
    }
    setReady(true)
  }, [])

  const dispatch = async () => {
    if (!prompt.trim() || selectedAIs.length === 0) return
    setLoading(true)
    setError('')
    setResponses([])

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, projectName, ais: selectedAIs, format, keys }),
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

  // Don't flash setup screen before localStorage loads
  if (!ready) return null

  // Show setup if no keys stored
  if (!hasAnyKey(keys)) {
    return <SetupScreen onComplete={k => setKeys(k)} />
  }

  const activeAIs = selectedAIs.filter(ai => {
    if (ai === 'openai' && !keys?.openai) return false
    if (ai === 'anthropic' && !keys?.anthropic) return false
    if (ai === 'grok' && !keys?.xai) return false
    return true
  })

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Multi-AI Hub</h1>
            <p className="text-gray-400 mt-1">Dispatch one prompt to ChatGPT, Claude, and Grok — download every response as a file</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            title="API Key Settings"
            className="p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Key status badges */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'openai', name: 'ChatGPT', has: !!keys?.openai, dot: 'bg-emerald-400' },
            { id: 'anthropic', name: 'Claude', has: !!keys?.anthropic, dot: 'bg-violet-400' },
            { id: 'xai', name: 'Grok', has: !!keys?.xai, dot: 'bg-blue-400' },
          ].map(ai => (
            <span key={ai.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${ai.has ? 'border-gray-700 text-gray-300' : 'border-gray-800 text-gray-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${ai.has ? ai.dot : 'bg-gray-700'}`} />
              {ai.name}
            </span>
          ))}
          {activeAIs.length < selectedAIs.length && (
            <button onClick={() => setShowSettings(true)} className="text-xs text-indigo-400 hover:text-indigo-300 ml-1">
              + add missing keys
            </button>
          )}
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

          <AISelector selected={selectedAIs} onChange={setSelectedAIs} keys={keys} />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Output Format</label>
            <div className="flex gap-2 items-center">
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
              <span className="ml-2 text-xs text-gray-600">
                {format === 'md' && 'Best for pasting into AI chats'}
                {format === 'txt' && 'Plain text — universal'}
                {format === 'json' && 'Structured data'}
              </span>
            </div>
          </div>

          <button
            onClick={dispatch}
            disabled={loading || !prompt.trim() || activeAIs.length === 0}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors text-sm tracking-wide"
          >
            {loading
              ? `Dispatching to ${activeAIs.length} AI${activeAIs.length !== 1 ? 's' : ''}...`
              : `Dispatch to ${activeAIs.length} AI${activeAIs.length !== 1 ? 's' : ''}`}
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
            {activeAIs.map(ai => (
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
                Responses <span className="text-gray-500 font-normal text-sm">— drag into any AI chat as context</span>
              </h2>
              <DownloadPanel responses={responses} projectName={projectName} />
            </div>
            {responses.map(r => (
              <ResponseCard key={r.ai} response={r} />
            ))}
          </div>
        )}
      </div>

      {showSettings && keys && (
        <SettingsModal
          keys={keys}
          onSave={setKeys}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  )
}
