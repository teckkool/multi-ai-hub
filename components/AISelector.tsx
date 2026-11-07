'use client'

const AIs = [
  { id: 'openai',    name: 'ChatGPT', model: 'gpt-4o',            badge: 'bg-emerald-900 text-emerald-300 border-emerald-700' },
  { id: 'anthropic', name: 'Claude',  model: 'claude-sonnet-4-6', badge: 'bg-violet-900 text-violet-300 border-violet-700' },
  { id: 'grok',      name: 'Grok',    model: 'grok-3',            badge: 'bg-blue-900 text-blue-300 border-blue-700' },
]

type Props = {
  selected: string[]
  onChange: (selected: string[]) => void
}

export default function AISelector({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Select AIs</label>
      <div className="grid grid-cols-3 gap-3">
        {AIs.map(ai => {
          const active = selected.includes(ai.id)
          return (
            <button
              key={ai.id}
              onClick={() => toggle(ai.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                active
                  ? `${ai.badge} border-opacity-100`
                  : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${active ? 'bg-current' : 'bg-gray-600'}`} />
                <span className="font-semibold text-sm">{ai.name}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 font-mono pl-4">{ai.model}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
