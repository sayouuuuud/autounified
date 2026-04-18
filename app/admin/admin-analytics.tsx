"use client"

import { useEffect, useState } from "react"

type AnalyticsData = {
  total: number
  last24h: number
  last7d: number
  daily: { day: string; count: number }[]
  topReferrers: { source: string; count: number }[]
  topCountries: { country: string; count: number }[]
  recent: {
    id: number
    path: string
    referrer: string | null
    country: string | null
    created_at: string
  }[]
}

export function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" })
      const json = (await res.json()) as { ok: boolean } & AnalyticsData & {
          error?: string
        }
      if (!res.ok || !json.ok) {
        setError(json.error || "Failed to load analytics.")
      } else {
        setData(json)
      }
    } catch {
      setError("Network error.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
            § overview
          </p>
          <h1 className="mt-1 font-sans text-3xl font-semibold leading-[1] tracking-[-0.03em] text-ink md:text-4xl">
            Visits & traffic
          </h1>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-lime disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="border-2 border-red bg-red/10 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red">
          {error}
        </div>
      ) : null}

      {/* Stat cards */}
      <div className="grid grid-cols-1 border-2 border-ink md:grid-cols-3">
        <StatCard label="Visits — total (30d)" value={data?.total ?? 0} loading={loading} />
        <StatCard label="Last 7 days" value={data?.last7d ?? 0} loading={loading} border />
        <StatCard label="Last 24 hours" value={data?.last24h ?? 0} loading={loading} border accent />
      </div>

      {/* Chart */}
      <DailyChart daily={data?.daily ?? []} loading={loading} />

      {/* Referrers + countries */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ListCard
          title="Top sources"
          emptyLabel="No traffic yet."
          items={(data?.topReferrers ?? []).map((r) => ({
            label: r.source,
            value: r.count,
          }))}
          loading={loading}
        />
        <ListCard
          title="Top countries"
          emptyLabel="Unknown."
          items={(data?.topCountries ?? []).map((r) => ({
            label: r.country || "??",
            value: r.count,
          }))}
          loading={loading}
        />
      </div>

      {/* Recent table */}
      <div className="border-2 border-ink bg-paper">
        <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
            Recent visits
          </p>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-lime/70">
            last 25
          </span>
        </div>
        {loading && !data ? (
          <div className="p-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
            Loading…
          </div>
        ) : (data?.recent?.length ?? 0) === 0 ? (
          <div className="p-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
            No visits yet — share the URL to start collecting data.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-ink bg-lime/40">
                  <Th>Time</Th>
                  <Th>Path</Th>
                  <Th>Country</Th>
                  <Th>Source</Th>
                </tr>
              </thead>
              <tbody>
                {data!.recent.map((r) => (
                  <tr key={r.id} className="border-b border-ink/15 last:border-b-0">
                    <Td mono>{formatRel(r.created_at)}</Td>
                    <Td mono>{r.path}</Td>
                    <Td mono>{r.country || "—"}</Td>
                    <Td mono>{r.referrer ? hostOf(r.referrer) : "direct"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  loading,
  border,
  accent,
}: {
  label: string
  value: number
  loading: boolean
  border?: boolean
  accent?: boolean
}) {
  return (
    <div
      className={[
        "relative bg-paper px-5 py-6 md:px-8 md:py-8",
        border ? "border-t-2 border-ink md:border-l-2 md:border-t-0" : "",
      ].join(" ")}
    >
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
        {label}
      </p>
      <div className="mt-4 flex items-baseline gap-2">
        <span
          className={[
            "nums font-sans font-bold leading-none tracking-[-0.04em]",
            accent ? "text-red" : "text-ink",
          ].join(" ")}
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
        >
          {loading ? "—" : value.toLocaleString("en-US")}
        </span>
        <span className="font-mono text-xs font-bold uppercase text-ink/50">visits</span>
      </div>
    </div>
  )
}

function DailyChart({
  daily,
  loading,
}: {
  daily: { day: string; count: number }[]
  loading: boolean
}) {
  const max = Math.max(1, ...daily.map((d) => d.count))
  return (
    <div className="border-2 border-ink bg-paper">
      <div className="flex items-center justify-between border-b-2 border-ink bg-lime/40 px-4 py-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
          Daily visits · last 30 days
        </p>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
          peak · {max.toLocaleString("en-US")}
        </p>
      </div>
      <div className="px-4 py-6 md:px-8 md:py-8">
        {loading && daily.length === 0 ? (
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
            Loading chart…
          </div>
        ) : (
          <div className="flex h-48 items-end gap-[2px]">
            {daily.map((d) => {
              const h = d.count === 0 ? 2 : Math.max(4, Math.round((d.count / max) * 180))
              return (
                <div
                  key={d.day}
                  className="group relative flex flex-1 flex-col items-center justify-end"
                  title={`${d.day} · ${d.count}`}
                >
                  <div
                    className={[
                      "w-full border-2 border-ink transition-colors",
                      d.count > 0 ? "bg-red" : "bg-ink/10",
                    ].join(" ")}
                    style={{ height: h }}
                  />
                </div>
              )
            })}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/50">
          <span>{daily[0]?.day ?? ""}</span>
          <span>today</span>
        </div>
      </div>
    </div>
  )
}

function ListCard({
  title,
  items,
  loading,
  emptyLabel,
}: {
  title: string
  items: { label: string; value: number }[]
  loading: boolean
  emptyLabel: string
}) {
  const total = items.reduce((a, b) => a + b.value, 0) || 1
  return (
    <div className="border-2 border-ink bg-paper">
      <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
          {title}
        </p>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-lime/60">
          {items.length}
        </span>
      </div>
      <div className="p-4 md:p-6">
        {loading && items.length === 0 ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
            Loading…
          </p>
        ) : items.length === 0 ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
            {emptyLabel}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((it) => {
              const pct = Math.round((it.value / total) * 100)
              return (
                <li key={it.label} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3 font-mono text-[12px] text-ink">
                    <span className="truncate">{it.label}</span>
                    <span className="font-bold">
                      {it.value} <span className="text-ink/50">· {pct}%</span>
                    </span>
                  </div>
                  <div className="relative h-2 w-full border border-ink bg-paper">
                    <div className="absolute inset-y-0 left-0 bg-red" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
      {children}
    </th>
  )
}
function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td
      className={[
        "whitespace-nowrap px-4 py-2 text-[12px] text-ink",
        mono ? "font-mono" : "font-sans",
      ].join(" ")}
    >
      {children}
    </td>
  )
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname || "direct"
  } catch {
    return url.slice(0, 24)
  }
}

function formatRel(iso: string) {
  const t = new Date(iso).getTime()
  const diff = Date.now() - t
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(iso).toISOString().slice(0, 16).replace("T", " ")
}
