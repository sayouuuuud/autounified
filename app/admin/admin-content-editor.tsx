"use client"

import { useMemo, useState } from "react"
import type { ContentMap } from "@/lib/content"
import {
  FIELD_HINTS,
  GROUP_LABELS,
  GROUP_ORDER,
  humanize,
  type FieldHint,
} from "./content-schema"

export function AdminContentEditor({
  content,
  onContentUpdated,
}: {
  content: ContentMap
  onContentUpdated: (next: ContentMap) => void
}) {
  const [draft, setDraft] = useState<ContentMap>(content)
  const [query, setQuery] = useState("")
  const [activeGroup, setActiveGroup] = useState<string>("all")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null)

  // Compute groups from the actual DB keys, keep GROUP_ORDER as primary order.
  const { groups, groupKeys } = useMemo(() => {
    const groupKeys: Record<string, string[]> = {}
    for (const key of Object.keys(draft)) {
      const g = key.split(".")[0] || "misc"
      if (!groupKeys[g]) groupKeys[g] = []
      groupKeys[g].push(key)
    }
    for (const g of Object.keys(groupKeys)) groupKeys[g].sort()
    const ordered = [
      ...GROUP_ORDER.filter((g) => groupKeys[g]),
      ...Object.keys(groupKeys)
        .filter((g) => !GROUP_ORDER.includes(g))
        .sort(),
    ]
    return { groups: ordered, groupKeys }
  }, [draft])

  // Changed keys (vs server-side content)
  const dirtyKeys = useMemo(() => {
    const out: string[] = []
    for (const k of Object.keys(draft)) {
      if ((content[k] ?? "") !== (draft[k] ?? "")) out.push(k)
    }
    return out
  }, [draft, content])

  // Filter by search + active group
  const visibleKeys = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base =
      activeGroup === "all"
        ? Object.keys(draft)
        : groupKeys[activeGroup] || []
    const filtered = base.filter((k) => {
      if (!q) return true
      const hint = FIELD_HINTS[k]
      return (
        k.toLowerCase().includes(q) ||
        (hint?.label?.toLowerCase().includes(q) ?? false) ||
        (draft[k] ?? "").toLowerCase().includes(q)
      )
    })
    filtered.sort()
    return filtered
  }, [draft, groupKeys, activeGroup, query])

  function updateField(key: string, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setMessage(null)
  }

  function reset() {
    setDraft(content)
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
      const json = (await res.json()) as { ok: boolean; error?: string; updated?: number }
      if (!res.ok || !json.ok) {
        setMessage({ kind: "err", text: json.error || "Save failed." })
      } else {
        const next = { ...draft }
        onContentUpdated(next)
        setMessage({
          kind: "ok",
          text: `Saved · ${json.updated ?? entries.length} field${
            (json.updated ?? entries.length) === 1 ? "" : "s"
          } updated.`,
        })
      }
    } catch {
      setMessage({ kind: "err", text: "Network error." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
            § content
          </p>
          <h1 className="mt-1 font-sans text-3xl font-semibold leading-[1] tracking-[-0.03em] text-ink md:text-4xl">
            Edit every text on the site
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={dirtyKeys.length === 0 || saving}
            className="border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-lime disabled:opacity-40"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={save}
            disabled={dirtyKeys.length === 0 || saving}
            className="shine group border-2 border-ink bg-ink px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-red disabled:opacity-60"
          >
            {saving
              ? "Saving…"
              : dirtyKeys.length === 0
                ? "No changes"
                : `Save ${dirtyKeys.length} change${dirtyKeys.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 border-2 border-ink bg-paper p-3 md:flex-row md:items-center md:gap-4 md:p-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search fields, labels, values…"
          className="flex-1 border-2 border-ink bg-paper px-3 py-2 font-mono text-[12px] text-ink outline-none focus:bg-lime/30"
        />
        <div className="flex items-center gap-2 overflow-x-auto">
          <GroupChip
            label="All"
            active={activeGroup === "all"}
            onClick={() => setActiveGroup("all")}
          />
          {groups.map((g) => (
            <GroupChip
              key={g}
              label={GROUP_LABELS[g] || humanize(g)}
              active={activeGroup === g}
              onClick={() => setActiveGroup(g)}
            />
          ))}
        </div>
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

      {/* Grouped fields */}
      <div className="flex flex-col gap-8">
        {groups
          .filter((g) => activeGroup === "all" || g === activeGroup)
          .map((g) => {
            const inGroup = visibleKeys.filter((k) => k.startsWith(`${g}.`))
            if (inGroup.length === 0) return null
            return (
              <section key={g} className="border-2 border-ink bg-paper">
                <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
                    {GROUP_LABELS[g] || humanize(g)}
                  </p>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-lime/60">
                    {inGroup.length} field{inGroup.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="flex flex-col">
                  {inGroup.map((key, i) => (
                    <FieldRow
                      key={key}
                      fieldKey={key}
                      value={draft[key] ?? ""}
                      originalValue={content[key] ?? ""}
                      onChange={(v) => updateField(key, v)}
                      hint={FIELD_HINTS[key]}
                      isFirst={i === 0}
                    />
                  ))}
                </div>
              </section>
            )
          })}

        {visibleKeys.length === 0 ? (
          <div className="border-2 border-dashed border-ink/30 bg-paper px-6 py-10 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
            No fields match your search.
          </div>
        ) : null}
      </div>

      {/* Sticky save bar on mobile */}
      {dirtyKeys.length > 0 ? (
        <div className="sticky bottom-3 z-30 mx-auto flex items-center justify-between gap-3 border-2 border-ink bg-ink px-4 py-3 text-paper shadow-[6px_6px_0_0_var(--ink)]">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
            {dirtyKeys.length} unsaved change{dirtyKeys.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              disabled={saving}
              className="border-2 border-paper/40 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:border-paper"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="border-2 border-paper bg-paper px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-lime disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function GroupChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "whitespace-nowrap border-2 border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-colors",
        active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-lime/50",
      ].join(" ")}
    >
      {label}
    </button>
  )
}

function FieldRow({
  fieldKey,
  value,
  originalValue,
  onChange,
  hint,
  isFirst,
}: {
  fieldKey: string
  value: string
  originalValue: string
  onChange: (v: string) => void
  hint: FieldHint | undefined
  isFirst: boolean
}) {
  const label = hint?.label || humanize(fieldKey)
  const multiline = hint?.multiline || value.length > 80 || value.includes("\n")
  const dirty = (originalValue ?? "") !== (value ?? "")

  return (
    <div
      className={[
        "grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-[260px_1fr] md:gap-6 md:px-6 md:py-5",
        isFirst ? "" : "border-t border-ink/15",
        dirty ? "bg-lime/20" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <label className="font-sans text-[14px] font-semibold leading-tight text-ink">
            {label}
          </label>
          {dirty ? (
            <span className="border border-red bg-red px-1 py-[1px] font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-paper">
              Edited
            </span>
          ) : null}
        </div>
        <code className="break-all font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">
          {fieldKey}
        </code>
        {hint?.help ? (
          <p className="mt-1 font-mono text-[10px] leading-relaxed text-ink/60">
            {hint.help}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={Math.min(8, Math.max(2, value.split("\n").length + 1))}
            className="w-full resize-y border-2 border-ink bg-paper px-3 py-2 font-mono text-[12px] leading-[1.55] text-ink outline-none transition-colors focus:bg-lime/30"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-[12px] text-ink outline-none transition-colors focus:bg-lime/30"
          />
        )}
        {dirty ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">
            was: <span className="text-ink/80">{originalValue || "∅"}</span>
          </p>
        ) : null}
      </div>
    </div>
  )
}
