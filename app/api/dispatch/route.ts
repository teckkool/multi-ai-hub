import { NextRequest, NextResponse } from 'next/server'
import { callOpenAI, callAnthropic, callGrok } from '@/lib/aiClients'

type ClientKeys = { openai?: string; anthropic?: string; xai?: string } | null

type AIConfig = {
  model: string
  label: string
  fn: (prompt: string, keys: ClientKeys) => Promise<string>
}

const AI_MAP: Record<string, AIConfig> = {
  openai:    { model: 'gpt-4o',            label: 'ChatGPT', fn: callOpenAI },
  anthropic: { model: 'claude-sonnet-4-6', label: 'Claude',  fn: callAnthropic },
  grok:      { model: 'grok-3',            label: 'Grok',    fn: callGrok },
}

function formatContent(
  aiId: string,
  model: string,
  prompt: string,
  response: string,
  format: string,
  projectName: string
): string {
  const label = AI_MAP[aiId]?.label ?? aiId
  const timestamp = new Date().toISOString()
  const project = projectName || 'untitled'

  if (format === 'json') {
    return JSON.stringify({ project, ai: label, model, prompt, response, timestamp }, null, 2)
  }

  if (format === 'md') {
    return [
      `# ${project} — ${label} Response`,
      '',
      `**Model:** \`${model}\`  `,
      `**Date:** ${timestamp}`,
      '',
      '## Prompt',
      '',
      prompt,
      '',
      '---',
      '',
      '## Response',
      '',
      response,
      '',
    ].join('\n')
  }

  // txt
  return [
    `Project : ${project}`,
    `AI      : ${label}`,
    `Model   : ${model}`,
    `Date    : ${timestamp}`,
    '',
    'Prompt:',
    prompt,
    '',
    '---',
    '',
    'Response:',
    response,
    '',
  ].join('\n')
}

export async function POST(req: NextRequest) {
  const { prompt, projectName, ais, format, keys } = await req.json()

  if (!prompt || !Array.isArray(ais) || ais.length === 0) {
    return NextResponse.json({ error: 'prompt and ais are required' }, { status: 400 })
  }

  const slug = (projectName || 'response').replace(/\s+/g, '-').toLowerCase()
  const date = new Date().toISOString().split('T')[0]
  const ext = format || 'md'

  const results = await Promise.allSettled(
    (ais as string[]).map(async (aiId) => {
      const config = AI_MAP[aiId]
      if (!config) throw new Error(`Unknown AI: ${aiId}`)

      const response = await config.fn(prompt, keys ?? null)
      const content = formatContent(aiId, config.model, prompt, response, ext, projectName)
      const aiSlug = aiId === 'openai' ? 'chatgpt' : aiId
      const filename = `${slug}_${aiSlug}_${date}.${ext}`

      return { ai: aiId, model: config.model, content, filename }
    })
  )

  const responses = results.map((result, i) => {
    const aiId = (ais as string[])[i]
    if (result.status === 'fulfilled') return result.value
    return {
      ai: aiId,
      model: AI_MAP[aiId]?.model ?? 'unknown',
      content: '',
      filename: '',
      error: result.reason?.message ?? 'Request failed',
    }
  })

  return NextResponse.json({ responses })
}
