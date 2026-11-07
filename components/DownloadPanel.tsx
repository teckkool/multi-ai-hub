'use client'

import { AIResponse } from './ResponseCard'

type Props = {
  responses: AIResponse[]
  projectName: string
}

export default function DownloadPanel({ responses, projectName }: Props) {
  const valid = responses.filter(r => !r.error && r.content)

  const downloadZip = async () => {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    const folderName = (projectName || 'multi-ai-output').replace(/\s+/g, '-').toLowerCase()
    const folder = zip.folder(folderName)!

    valid.forEach(r => folder.file(r.filename, r.content))

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${folderName}.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={downloadZip}
      disabled={valid.length === 0}
      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white text-sm font-semibold rounded-lg transition-colors"
    >
      Download All as ZIP ({valid.length} {valid.length === 1 ? 'file' : 'files'})
    </button>
  )
}
