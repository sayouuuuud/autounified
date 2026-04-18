import { NextResponse } from "next/server"
import { adminEnv, createSession } from "@/lib/session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as {
      email?: string
      password?: string
    }
    const cfg = adminEnv()
    if (!cfg.email || !cfg.password) {
      return NextResponse.json(
        { ok: false, error: "Server is missing ADMIN_EMAIL / ADMIN_PASSWORD env vars." },
        { status: 500 },
      )
    }
    const e = (email || "").trim().toLowerCase()
    const p = password || ""
    if (e !== cfg.email.trim().toLowerCase() || p !== cfg.password) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 },
      )
    }
    await createSession(cfg.email)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.log("[v0] /api/admin/login error:", (err as Error).message)
    return NextResponse.json(
      { ok: false, error: "Login failed." },
      { status: 500 },
    )
  }
}
