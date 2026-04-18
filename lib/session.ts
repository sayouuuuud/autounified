import { cookies } from "next/headers"
import { sbDelete, sbInsert, sbSelect } from "./supabase"

const COOKIE_NAME = "au_admin"
const SESSION_MAX_AGE_DAYS = 14

type SessionRow = {
  token: string
  email: string
  expires_at: string
}

function randomToken() {
  // 32 bytes -> 64 hex chars
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function createSession(email: string) {
  const token = randomToken()
  const expiresAt = new Date(
    Date.now() + SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
  )
  await sbInsert("admin_sessions", {
    token,
    email,
    expires_at: expiresAt.toISOString(),
  })
  const jar = await cookies()
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })
  return token
}

export async function getSession(): Promise<{ email: string } | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const rows = await sbSelect<SessionRow[]>(
      "admin_sessions",
      `token=eq.${encodeURIComponent(token)}&select=email,expires_at&limit=1`,
    )
    const row = rows[0]
    if (!row) return null
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await destroySession().catch(() => {})
      return null
    }
    return { email: row.email }
  } catch (err) {
    console.log("[v0] getSession error:", (err as Error).message)
    return null
  }
}

export async function destroySession() {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (token) {
    try {
      await sbDelete(
        "admin_sessions",
        `token=eq.${encodeURIComponent(token)}`,
      )
    } catch (err) {
      console.log("[v0] destroySession error:", (err as Error).message)
    }
  }
  jar.delete(COOKIE_NAME)
}

export function adminEnv() {
  return {
    email: process.env.ADMIN_EMAIL || "",
    password: process.env.ADMIN_PASSWORD || "",
  }
}
