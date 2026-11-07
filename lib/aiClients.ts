import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export async function callOpenAI(prompt: string): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  })
  return res.choices[0].message.content ?? ''
}

export async function callAnthropic(prompt: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const res = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })
  const block = res.content[0]
  return block.type === 'text' ? block.text : ''
}

export async function callGrok(prompt: string): Promise<string> {
  // Grok uses an OpenAI-compatible API
  const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  })
  const res = await client.chat.completions.create({
    model: 'grok-3',
    messages: [{ role: 'user', content: prompt }],
  })
  return res.choices[0].message.content ?? ''
}
