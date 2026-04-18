"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { ContentMap } from "@/lib/content"
import { AdminAnalytics } from "./admin-analytics"
import { AdminContentEditor } from "./admin-content-editor"
import { AdminSettings } from "./admin-settings"

type Tab = "overview" | "content" | "settings"

export function AdminDashboard({
  initialContent,
  email,
}: {
  initialContent: ContentMap
  email: string
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("overview")
  const [content, setContent] = useState<ContentMap>(initialContent)
  const [loggingOut, setLoggingOut] = useState(false)

  const keys = useMemo(() => Object.keys(content).sort(), [content])

  useEffect(() => {
    // Refresh content map from server in case a separate tab updated it.
    const ac = new AbortController()
    fetch("/api/admin/content", { signal: ac.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && data.content) setContent(data.content)
      })
      .catch(() => {})
    return () => ac.abort()
  }, [])

  async function logout() {
    setLoggingOut(true)
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {})
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <div aria-hidden className="pointer-events-none fixed inset-0 grid-paper opacity-40" />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 border-2 border-ink bg-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-lime">
              /admin · console
            </span>
            <span className="hidden font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink sm:inline">
              autounified.com
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink md:flex">
              <span className="relative inline-flex h-2 w-2">
                <span aria-hidden className="absolute inline-flex h-full w-full bg-red pulse-ring" />
                <span className="relative inline-flex h-2 w-2 bg-red" />
              </span>
              {email}
            </span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-lime sm:inline-block"
            >
              View site ↗
            </a>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="border-2 border-ink bg-ink px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-red disabled:opacity-60"
            >
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t-2 border-ink">
          <div className="mx-auto flex max-w-[1280px] items-center gap-0 overflow-x-auto px-4 md:px-8">
            {([
              ["overview", "Overview"],
              ["content", "Content"],
              ["settings", "Settings"],
            ] as const).map(([k, l]) => {
              const active = tab === k
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  className={[
                    "relative -mb-[2px] border-b-2 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors",
                    active
                      ? "border-red text-ink"
                      : "border-transparent text-ink/60 hover:text-ink",
                  ].join(" ")}
                >
                  {l}
                </button>
              )
            })}
            <span className="ml-auto hidden font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60 md:inline">
              {keys.length} editable keys
            </span>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-14">
        {tab === "overview" ? <AdminAnalytics /> : null}
        {tab === "content" ? (
          <AdminContentEditor
            content={content}
            onContentUpdated={(next) => setContent(next)}
          />
        ) : null}
        {tab === "settings" ? (
          <AdminSettings
            content={content}
            onContentUpdated={(next) => setContent(next)}
          />
        ) : null}
      </div>
    </main>
  )
}
