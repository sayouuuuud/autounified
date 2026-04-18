import { isSupabaseConfigured, sbSelect } from "./supabase"

export type ContentMap = Record<string, string>

type Row = { key: string; value: string }

// Fetch the full key/value map for the site. Returns {} if supabase is not
// configured so the public site can still render with fallbacks.
export async function getContent(): Promise<ContentMap> {
  if (!isSupabaseConfigured()) return {}
  try {
    const rows = await sbSelect<Row[]>(
      "site_content",
      "select=key,value&limit=1000",
    )
    const map: ContentMap = {}
    for (const row of rows) map[row.key] = row.value
    return map
  } catch (err) {
    console.log("[v0] getContent error:", (err as Error).message)
    return {}
  }
}

// Helper: pick a value, falling back to a default literal if the key is
// missing. Used by every public component so a fresh DB still renders.
export function pick(map: ContentMap | undefined, key: string, fallback: string) {
  if (!map) return fallback
  const v = map[key]
  return typeof v === "string" && v.length > 0 ? v : fallback
}
