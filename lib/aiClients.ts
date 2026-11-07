import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

type ClientKeys = { openai?: string; anthropic?: string; xai?: string } | null

export async function callOpenAI(prompt: string, keys: ClientKeys): Promise<string> {
  const apiKey = keys?.openai || process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('No OpenAI API key provided')
  const client = new OpenAI({ apiKey })
  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  })
  return res.choices[0].message.content ?? ''
}

export async function callAnthropic(prompt: string, keys: ClientKeys): Promise<string> {
  const apiKey = keys?.anthropic || process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('No Anthropic API key provided')
  const client = new Anthropic({ apiKey })
  const res = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })
  const block = res.content[0]
  return block.type === 'text' ? block.text : ''
}

export async function callGrok(prompt: string, keys: ClientKeys): Promise<string> {
  const apiKey = keys?.xai || process.env.XAI_API_KEY
  if (!apiKey) throw new Error('No xAI API key provided')
  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1',
  })
  const res = await client.chat.completions.create({
    model: 'grok-3',
    messages: [{ role: 'user', content: prompt }],
  })
  return res.choices[0].message.content ?? ''
}
