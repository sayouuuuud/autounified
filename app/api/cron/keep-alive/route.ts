import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Runs daily via Vercel Cron (see vercel.json).
// Pings Supabase so the project does not pause from inactivity.
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: Request) {
  // Vercel Cron sends this header automatically.
  // If CRON_SECRET is set, require it; otherwise accept any Vercel cron invocation.
  const authHeader = req.headers.get("authorization")
  const secret = process.env.CRON_SECRET

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  const startedAt = Date.now()
  const admin = supabaseAdmin()
  const results: Record<string, { ok: boolean; info?: unknown; error?: string }> = {}

  // 1. Touch site_content (read)
  try {
    const { count, error } = await admin
      .from("site_content")
      .select("*", { count: "exact", head: true })
    if (error) throw error
    results.site_content = { ok: true, info: { rows: count ?? 0 } }
  } catch (err) {
    results.site_content = { ok: false, error: (err as Error).message }
  }

  // 2. Touch page_visits (read)
  try {
    const { count, error } = await admin
      .from("page_visits")
      .select("*", { count: "exact", head: true })
    if (error) throw error
    results.page_visits = { ok: true, info: { rows: count ?? 0 } }
  } catch (err) {
    results.page_visits = { ok: false, error: (err as Error).message }
  }

  // 3. Touch admin_sessions (read + prune expired so table stays tidy)
  try {
    const { error: delError } = await admin
      .from("admin_sessions")
      .delete()
      .lt("expires_at", new Date().toISOString())
    if (delError) throw delError

    const { count, error } = await admin
      .from("admin_sessions")
      .select("*", { count: "exact", head: true })
    if (error) throw error
    results.admin_sessions = { ok: true, info: { active: count ?? 0 } }
  } catch (err) {
    results.admin_sessions = { ok: false, error: (err as Error).message }
  }

  // 4. Write a small heartbeat row to site_content (upsert) so every table
  //    (incl. write path) gets touched each day. We store the last ping time.
  try {
    const { error } = await admin.from("site_content").upsert(
      {
        key: "system.last_keepalive",
        value: new Date().toISOString(),
        section: "system",
        description: "Auto-updated daily by cron to prevent Supabase pause.",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    )
    if (error) throw error
    results.heartbeat_write = { ok: true }
  } catch (err) {
    results.heartbeat_write = { ok: false, error: (err as Error).message }
  }

  const allOk = Object.values(results).every((r) => r.ok)
  return NextResponse.json(
    {
      ok: allOk,
      ranAt: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
      results,
    },
    { status: allOk ? 200 : 500 },
  )
}
