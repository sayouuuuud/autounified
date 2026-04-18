"use client"

import { useMemo, useState } from "react"
import type { ContentMap } from "@/lib/content"

const QUICK_FIELDS: { key: string; label: string; help?: string; multiline?: boolean }[] = [
  {
    key: "site.price_usd",
    label: "Price — numeric value (USD)",
    help: "Drives the big animated number on Hero & Acquisition. Digits only (e.g. 1000).",
  },
  {
    key: "site.price_label",
    label: "Price — label ($1,000)",
    help: "Appears in text like the nav CTA and inside the hero button.",
  },
  {
    key: "site.sales_email",
    label: "Sales email",
    help: "Public contact; shown in footer & used inside the buy link.",
  },
  {
    key: "site.buy_url",
    label: "Primary Buy link",
    multiline: true,
    help: "Full URL (mailto: or https://…). Used by the Hero CTA, Nav CTA, and Acquisition card.",
  },
  {
    key: "site.question_url",
    label: "Ask-a-question link",
    multiline: true,
    help: "Secondary CTA on the Acquisition card.",
  },
  {
    key: "nav.cta",
    label: "Nav buy-button text",
  },
  {
    key: "hero.cta_primary",
    label: "Hero primary CTA text",
  },
]

export function AdminSettings({
  content,
  onContentUpdated,
}: {
  content: ContentMap
  onContentUpdated: (next: ContentMap) => void
}) {
  const [draft, setDraft] = useState<ContentMap>(() => {
    const d: ContentMap = {}
    for (const f of QUICK_FIELDS) d[f.key] = content[f.key] ?? ""
    return d
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null)

  const dirtyKeys = useMemo(
    () => QUICK_FIELDS.map((f) => f.key).filter((k) => (content[k] ?? "") !== (draft[k] ?? "")),
    [draft, content],
  )

  function update(key: string, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setMessage(null)
  }

  async function save() {
    if (dirtyKeys.length === 0) return
    setSaving(true)
    setMessage(null)
    try {
      const entries = dirtyKeys.map((k) => ({ key: k, value: draft[k] ?? "" }))
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      })
      const json = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !json.ok) {
        setMessage({ kind: "err", text: json.error || "Save failed." })
      } else {
        const merged = { ...content }
        for (const k of dirtyKeys) merged[k] = draft[k] ?? ""
        onContentUpdated(merged)
        setMessage({ kind: "ok", text: "Settings saved." })
      }
    } catch {
      setMessage({ kind: "err", text: "Network error." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
            § settings
          </p>
          <h1 className="mt-1 font-sans text-3xl font-semibold leading-[1] tracking-[-0.03em] text-ink md:text-4xl">
            Price & sale link
          </h1>
          <p className="mt-2 max-w-xl font-mono text-[12px] leading-relaxed text-ink/60">
            Quick access to the most-edited fields. Everything else — section
            copy, nav labels, footer — lives under{" "}
            <span className="font-bold text-ink">Content</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={dirtyKeys.length === 0 || saving}
          className="shine border-2 border-ink bg-ink px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-red disabled:opacity-60"
        >
          {saving
            ? "Saving…"
            : dirtyKeys.length === 0
              ? "No changes"
              : `Save ${dirtyKeys.length}`}
        </button>
      </div>

      {message ? (
        <div
          className={[
            "border-2 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em]",
            message.kind === "ok"
              ? "border-ink bg-lime text-ink"
              : "border-red bg-red/10 text-red",
          ].join(" ")}
        >
          {message.text}
        </div>
      ) : null}

      <div className="border-2 border-ink bg-paper">
        {QUICK_FIELDS.map((f, i) => {
          const v = draft[f.key] ?? ""
          const original = content[f.key] ?? ""
          const dirty = v !== original
          return (
            <div
              key={f.key}
              className={[
                "grid grid-cols-1 gap-3 px-4 py-5 md:grid-cols-[260px_1fr] md:gap-6 md:px-6 md:py-6",
                i === 0 ? "" : "border-t border-ink/15",
                dirty ? "bg-lime/20" : "",
              ].join(" ")}
            >
              <div>
                <div className="flex items-center gap-2">
                  <label className="font-sans text-[14px] font-semibold text-ink">
                    {f.label}
                  </label>
                  {dirty ? (
                    <span className="border border-red bg-red px-1 py-[1px] font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-paper">
                      Edited
                    </span>
                  ) : null}
                </div>
                <code className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">
                  {f.key}
                </code>
                {f.help ? (
                  <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink/60">
                    {f.help}
                  </p>
                ) : null}
              </div>
              <div>
                {f.multiline ? (
                  <textarea
                    value={v}
                    onChange={(e) => update(f.key, e.target.value)}
                    rows={3}
                    className="w-full resize-y border-2 border-ink bg-paper px-3 py-2 font-mono text-[12px] leading-[1.55] text-ink outline-none focus:bg-lime/30"
                  />
                ) : (
                  <input
                    type="text"
                    value={v}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-[12px] text-ink outline-none focus:bg-lime/30"
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
