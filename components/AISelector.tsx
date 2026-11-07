'use client'

import { StoredKeys } from '@/lib/keyStore'

const AIs = [
  { id: 'openai',    name: 'ChatGPT', model: 'gpt-4o',            keyField: 'openai' as keyof StoredKeys,    dot: 'bg-emerald-400', active: 'border-emerald-700 bg-emerald-950 text-white' },
  { id: 'anthropic', name: 'Claude',  model: 'claude-sonnet-4-6', keyField: 'anthropic' as keyof StoredKeys, dot: 'bg-violet-400',  active: 'border-violet-700 bg-violet-950 text-white' },
  { id: 'grok',      name: 'Grok',    model: 'grok-3',            keyField: 'xai' as keyof StoredKeys,       dot: 'bg-blue-400',    active: 'border-blue-700 bg-blue-950 text-white' },
]

type Props = {
  selected: string[]
  onChange: (selected: string[]) => void
  keys: StoredKeys | null
}

export default function AISelector({ selected, onChange, keys }: Props) {
  const toggle = (id: string, hasKey: boolean) => {
    if (!hasKey) return
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">Select AIs</label>
      <div className="grid grid-cols-3 gap-3">
        {AIs.map(ai => {
          const hasKey = !!(keys?.[ai.keyField])
          const isSelected = selected.includes(ai.id)

          return (
            <button
              key={ai.id}
              onClick={() => toggle(ai.id, hasKey)}
              disabled={!hasKey}
              title={!hasKey ? `No API key for ${ai.name} — click the settings icon to add one` : ''}
              className={`p-4 rounded-lg border text-left transition-all ${
                !hasKey
                  ? 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed'
                  : isSelected
                  ? ai.active
                  : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${hasKey ? (isSelected ? ai.dot : 'bg-gray-600') : 'bg-gray-700'}`} />
                <span className="font-semibold text-sm">{ai.name}</span>
                {!hasKey && <span className="text-xs text-gray-600 ml-auto">no key</span>}
              </div>
              <div className="text-xs text-gray-500 mt-1 font-mono pl-4">{ai.model}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
