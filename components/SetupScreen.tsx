'use client'

import { useState } from 'react'
import { saveKeys, StoredKeys } from '@/lib/keyStore'

type Props = {
  onComplete: (keys: StoredKeys) => void
}

type FieldState = {
  value: string
  show: boolean
}

const AI_FIELDS = [
  {
    id: 'openai' as keyof StoredKeys,
    name: 'ChatGPT',
    model: 'GPT-4o',
    placeholder: 'sk-proj-...',
    color: 'emerald',
    hint: 'platform.openai.com → API Keys',
    dot: 'bg-emerald-400',
    ring: 'focus:border-emerald-500',
  },
  {
    id: 'anthropic' as keyof StoredKeys,
    name: 'Claude',
    model: 'claude-sonnet-4-6',
    placeholder: 'sk-ant-...',
    color: 'violet',
    hint: 'console.anthropic.com → API Keys',
    dot: 'bg-violet-400',
    ring: 'focus:border-violet-500',
  },
  {
    id: 'xai' as keyof StoredKeys,
    name: 'Grok',
    model: 'grok-3',
    placeholder: 'xai-...',
    color: 'blue',
    hint: 'console.x.ai → API Keys',
    dot: 'bg-blue-400',
    ring: 'focus:border-blue-500',
  },
]

export default function SetupScreen({ onComplete }: Props) {
  const [fields, setFields] = useState<Record<keyof StoredKeys, FieldState>>({
    openai:    { value: '', show: false },
    anthropic: { value: '', show: false },
    xai:       { value: '', show: false },
  })
  const [error, setError] = useState('')

  const set = (id: keyof StoredKeys, patch: Partial<FieldState>) => {
    setFields(f => ({ ...f, [id]: { ...f[id], ...patch } }))
  }

  const handleSave = () => {
    const keys: StoredKeys = {
      openai:    fields.openai.value.trim(),
      anthropic: fields.anthropic.value.trim(),
      xai:       fields.xai.value.trim(),
    }
    if (!keys.openai && !keys.anthropic && !keys.xai) {
      setError('Enter at least one API key to continue.')
      return
    }
    saveKeys(keys)
    onComplete(keys)
  }

  const anyFilled = Object.values(fields).some(f => f.value.trim())

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-700 mb-4">
            <span className="text-2xl font-bold text-white font-mono">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Multi-AI Hub</h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your API keys to get started. Keys are saved locally on your device only.</p>
        </div>

        {/* Key inputs */}
        <div className="space-y-4 mb-6">
          {AI_FIELDS.map(ai => (
            <div key={ai.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${ai.dot}`} />
                <span className="font-semibold text-white text-sm">{ai.name}</span>
                <span className="text-xs text-gray-500 font-mono">{ai.model}</span>
              </div>
              <div className="relative">
                <input
                  type={fields[ai.id].show ? 'text' : 'password'}
                  value={fields[ai.id].value}
                  onChange={e => set(ai.id, { value: e.target.value })}
                  placeholder={ai.placeholder}
                  className={`w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 pr-20 text-white placeholder-gray-600 text-sm font-mono focus:outline-none ${ai.ring} transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => set(ai.id, { show: !fields[ai.id].show })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300 transition-colors px-1"
                >
                  {fields[ai.id].show ? 'hide' : 'show'}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1.5 pl-1">Get key at: {ai.hint}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!anyFilled}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors"
        >
          Save Keys & Launch
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          Keys are stored in your browser — never sent anywhere except the AI APIs.
        </p>
      </div>
    </div>
  )
}
