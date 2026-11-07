export type StoredKeys = {
  openai: string
  anthropic: string
  xai: string
}

const KEY = 'multi_ai_hub_keys'

export function saveKeys(keys: StoredKeys) {
  localStorage.setItem(KEY, JSON.stringify(keys))
}

export function loadKeys(): StoredKeys | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function clearKeys() {
  localStorage.removeItem(KEY)
}

export function hasAnyKey(keys: StoredKeys | null): boolean {
  if (!keys) return false
  return !!(keys.openai || keys.anthropic || keys.xai)
}
