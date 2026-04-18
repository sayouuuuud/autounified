// Self-triggered keep-alive.
// No external services, no Vercel Cron. Every time the site receives ANY
// request (a visit, an admin view, or even a page render), we check whether
// more than ~20 hours passed since the last heartbeat. If yes, we write a
// new one. That single write is enough to keep Supabase from pausing the
// database on free/inactive projects.
//
// Guarantees:
//  - Fire-and-forget: never blocks the caller.
//  - In-memory lock + in-memory last-ping cache: only one request per
//    serverless instance ever runs the DB check per interval.
//  - Uses the same sbInsert/sbSelect helpers as the rest of the app.

import { isSupabaseConfigured, sbInsert, sbSelect } from "@/lib/supabase"

const KEY = "_system.keepalive"
const MIN_INTERVAL_MS = 20 * 60 * 60 * 1000 // 20 hours

// Module-level cache, persists across warm requests inside the same instance.
let lastCheckedAt = 0
let inFlight: Promise<void> | null = null

type Row = { key: string; value: string; updated_at: string }

async function runHeartbeat(): Promise<void> {
  // 1) Read the current heartbeat row.
  const rows = await sbSelect<Row[]>(
    "site_content",
    `key=eq.${encodeURIComponent(KEY)}&select=key,value,updated_at&limit=1`,
  )
  const row = rows?.[0]
  const last = row ? new Date(row.updated_at).getTime() : 0
  const now = Date.now()

  if (row && now - last < MIN_INTERVAL_MS) {
    // Someone else already pinged recently — nothing to do.
    return
  }

  // 2) Upsert a fresh heartbeat value. The write itself is what keeps the
  //    database "active" from Supabase's perspective.
  await sbInsert(
    "site_content",
    {
      key: KEY,
      value: new Date(now).toISOString(),
      updated_at: new Date(now).toISOString(),
    },
    { onConflict: "key" },
  )
}

/**
 * Triggers a heartbeat if enough time has passed since the last one.
 * Safe to call from anywhere, on every request. Never throws.
 */
export function triggerKeepAlive(): void {
  if (!isSupabaseConfigured()) return

  const now = Date.now()

  // In-memory fast path: if this instance already pinged recently, bail.
  if (now - lastCheckedAt < MIN_INTERVAL_MS) return

  // Coalesce concurrent callers inside the same instance.
  if (inFlight) return

  lastCheckedAt = now
  inFlight = runHeartbeat()
    .catch((err) => {
      // Reset the memory cache so we try again on the next request
      // instead of waiting 20h after a transient failure.
      lastCheckedAt = 0
      console.log("[v0] keep-alive failed:", (err as Error).message)
    })
    .finally(() => {
      inFlight = null
    })
}
