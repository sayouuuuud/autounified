import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sbSelect } from "@/lib/supabase"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Visit = {
  id: number
  path: string
  referrer: string | null
  user_agent: string | null
  country: string | null
  created_at: string
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  try {
    // Pull the last 30 days of visits (capped at 5000 rows for safety).
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const rows = await sbSelect<Visit[]>(
      "page_visits",
      `select=id,path,referrer,user_agent,country,created_at&created_at=gte.${encodeURIComponent(
        since,
      )}&order=created_at.desc&limit=5000`,
    )

    const total = rows.length

    // Last 24h
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000
    const last24h = rows.filter((r) => new Date(r.created_at).getTime() >= dayAgo).length

    // Last 7d
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const last7d = rows.filter((r) => new Date(r.created_at).getTime() >= weekAgo).length

    // Daily counts for the last 30 days
    const byDay: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setUTCHours(0, 0, 0, 0)
      d.setUTCDate(d.getUTCDate() - i)
      byDay[d.toISOString().slice(0, 10)] = 0
    }
    for (const r of rows) {
      const day = new Date(r.created_at).toISOString().slice(0, 10)
      if (day in byDay) byDay[day] += 1
    }
    const daily = Object.entries(byDay).map(([day, count]) => ({ day, count }))

    // Top referrers
    const refCounts: Record<string, number> = {}
    for (const r of rows) {
      const key = r.referrer ? hostOf(r.referrer) : "direct"
      refCounts[key] = (refCounts[key] ?? 0) + 1
    }
    const topReferrers = Object.entries(refCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, count]) => ({ source, count }))

    // Top countries
    const countryCounts: Record<string, number> = {}
    for (const r of rows) {
      const key = r.country || "??"
      countryCounts[key] = (countryCounts[key] ?? 0) + 1
    }
    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([country, count]) => ({ country, count }))

    const recent = rows.slice(0, 25).map((r) => ({
      id: r.id,
      path: r.path,
      referrer: r.referrer,
      country: r.country,
      created_at: r.created_at,
    }))

    return NextResponse.json({
      ok: true,
      total,
      last24h,
      last7d,
      daily,
      topReferrers,
      topCountries,
      recent,
    })
  } catch (err) {
    console.log("[v0] /api/admin/analytics error:", (err as Error).message)
    return NextResponse.json({ ok: false, error: "Analytics failed." }, { status: 500 })
  }
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname || "direct"
  } catch {
    return url.slice(0, 32)
  }
}
