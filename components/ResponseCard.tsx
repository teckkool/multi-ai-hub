'use client'

export type AIResponse = {
  ai: string
  model: string
  content: string
  filename: string
  error?: string
}

const AI_META: Record<string, { label: string; ring: string }> = {
  openai:    { label: 'ChatGPT', ring: 'border-emerald-700' },
  anthropic: { label: 'Claude',  ring: 'border-violet-700' },
  grok:      { label: 'Grok',    ring: 'border-blue-700' },
}

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ResponseCard({ response }: { response: AIResponse }) {
  const meta = AI_META[response.ai] ?? { label: response.ai, ring: 'border-gray-700' }
  const ext = response.filename.split('.').pop()?.toUpperCase() ?? 'FILE'

  return (
    <div className={`rounded-lg border ${response.error ? 'border-red-700 bg-red-900/10' : `${meta.ring} bg-gray-900`}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white">{meta.label}</span>
          <span className="text-xs text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded">{response.model}</span>
          {response.filename && (
            <span className="text-xs text-gray-600 font-mono">{response.filename}</span>
          )}
        </div>
        {!response.error && response.content && (
          <button
            onClick={() => downloadFile(response.filename, response.content)}
            className="text-sm px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded border border-gray-600 transition-colors font-medium"
          >
            Download {ext}
          </button>
        )}
      </div>
      <div className="p-4">
        {response.error ? (
          <p className="text-red-400 text-sm">{response.error}</p>
        ) : (
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-72 overflow-y-auto">
            {response.content}
          </pre>
        )}
      </div>
    </div>
  )
}
