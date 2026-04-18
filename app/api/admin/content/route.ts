import { NextResponse } from "next/server"
import { getContent } from "@/lib/content"
import { getSession } from "@/lib/session"
import { sbInsert } from "@/lib/supabase"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  const map = await getContent()
  return NextResponse.json({ ok: true, content: map })
}

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { entries } = (await req.json()) as {
      entries?: Array<{ key: string; value: string }>
    }
    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ ok: false, error: "No entries provided." }, { status: 400 })
    }
    const rows = entries
      .filter((e) => typeof e?.key === "string" && e.key.trim().length > 0)
      .map((e) => ({
        key: e.key.trim(),
        value: String(e.value ?? ""),
        updated_at: new Date().toISOString(),
      }))
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "No valid entries." }, { status: 400 })
    }
    await sbInsert("site_content", rows, { onConflict: "key" })
    return NextResponse.json({ ok: true, updated: rows.length })
  } catch (err) {
    console.log("[v0] /api/admin/content PUT error:", (err as Error).message)
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 500 })
  }
}
