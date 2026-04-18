"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed.")
        setLoading(false)
        return
      }
      router.replace("/admin")
      router.refresh()
    } catch {
      setError("Network error.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
      <div>
        <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
          Email
        </label>
        <input
          type="email"
          required
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border-2 border-ink bg-paper px-3 py-3 font-mono text-sm text-ink outline-none transition-colors focus:bg-lime/40"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
          Password
        </label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border-2 border-ink bg-paper px-3 py-3 font-mono text-sm text-ink outline-none transition-colors focus:bg-lime/40"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <div className="border-2 border-red bg-red/10 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="shine group flex w-full items-center justify-between border-2 border-ink bg-ink px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-red disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{loading ? "Authenticating…" : "Enter console"}</span>
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  )
}
