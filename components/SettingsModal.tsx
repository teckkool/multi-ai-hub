'use client'

import { useState } from 'react'
import { saveKeys, clearKeys, StoredKeys } from '@/lib/keyStore'

type Props = {
  keys: StoredKeys
  onSave: (keys: StoredKeys) => void
  onClose: () => void
}

const AI_FIELDS = [
  { id: 'openai' as keyof StoredKeys,    name: 'ChatGPT', placeholder: 'sk-proj-...', dot: 'bg-emerald-400', ring: 'focus:border-emerald-500' },
  { id: 'anthropic' as keyof StoredKeys, name: 'Claude',  placeholder: 'sk-ant-...',  dot: 'bg-violet-400',  ring: 'focus:border-violet-500' },
  { id: 'xai' as keyof StoredKeys,       name: 'Grok',    placeholder: 'xai-...',     dot: 'bg-blue-400',    ring: 'focus:border-blue-500' },
]

export default function SettingsModal({ keys, onSave, onClose }: Props) {
  const [fields, setFields] = useState<StoredKeys>({ ...keys })
  const [show, setShow] = useState<Record<string, boolean>>({})

  const handleSave = () => {
    saveKeys(fields)
    onSave(fields)
    onClose()
  }

  const handleClear = () => {
    clearKeys()
    onSave({ openai: '', anthropic: '', xai: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">API Keys</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl leading-none">×</button>
        </div>

        <div className="space-y-4 mb-6">
          {AI_FIELDS.map(ai => (
            <div key={ai.id}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2 h-2 rounded-full ${ai.dot}`} />
                <label className="text-sm font-medium text-gray-300">{ai.name}</label>
              </div>
              <div className="relative">
                <input
                  type={show[ai.id] ? 'text' : 'password'}
                  value={fields[ai.id]}
                  onChange={e => setFields(f => ({ ...f, [ai.id]: e.target.value }))}
                  placeholder={ai.placeholder}
                  className={`w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 pr-16 text-white placeholder-gray-600 text-sm font-mono focus:outline-none ${ai.ring} transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => ({ ...s, [ai.id]: !s[ai.id] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
                >
                  {show[ai.id] ? 'hide' : 'show'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 rounded-lg transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  )
}
