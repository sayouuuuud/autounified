import { NextResponse } from "next/server"
import { isSupabaseConfigured, sbInsert } from "@/lib/supabase"
import { triggerKeepAlive } from "@/lib/keep-alive"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, skipped: true })
  }
  // Piggy-back the heartbeat on every visit recorded.
  triggerKeepAlive()
  try {
    const { path, referrer } = (await req.json().catch(() => ({}))) as {
      path?: string
      referrer?: string
    }
    const userAgent = req.headers.get("user-agent") ?? null
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      null

    await sbInsert("page_visits", {
      path: path || "/",
      referrer: referrer || null,
      user_agent: userAgent,
      country,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.log("[v0] /api/visit error:", (err as Error).message)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
