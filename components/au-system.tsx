"use client"

import { useEffect, useState } from "react"
import { AuGear } from "./au-gear"
import { useCopy } from "./content-provider"

const stations = [
  { id: "01", name: "INGEST", hint: "raw signals" },
  { id: "02", name: "NORMALIZE", hint: "schema align" },
  { id: "03", name: "ORCHESTRATE", hint: "route + plan" },
  { id: "04", name: "EXECUTE", hint: "run agents" },
  { id: "05", name: "PUBLISH", hint: "emit result" },
]

const tasks = [
  { id: "T-0481", state: "DONE", label: "parse invoice.pdf" },
  { id: "T-0482", state: "RUN", label: "enrich customer_id=7733" },
  { id: "T-0483", state: "RUN", label: "summarize meeting · 14:20z" },
  { id: "T-0484", state: "QUEUED", label: "sync crm → warehouse" },
  { id: "T-0485", state: "DONE", label: "classify ticket #a/812" },
  { id: "T-0486", state: "RUN", label: "generate monthly report" },
  { id: "T-0487", state: "QUEUED", label: "refresh embeddings · v4" },
  { id: "T-0488", state: "DONE", label: "notify on-call · rotation" },
]

function stateStyle(s: string) {
  if (s === "DONE") return "bg-lime text-ink"
  if (s === "RUN") return "bg-red text-paper"
  return "bg-ink text-paper"
}

function pad(n: number, w = 7) {
  return n.toLocaleString("en-US").padStart(w, " ")
}

export function AuSystem() {
  const t = useCopy()
  const [eps, setEps] = useState(1247)
  const [total, setTotal] = useState(1_234_567)
  const [active, setActive] = useState(0)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const i = setInterval(() => {
      setEps((p) => Math.max(800, p + Math.floor(Math.random() * 80) - 40))
      setTotal((p) => p + Math.floor(Math.random() * 37) + 9)
      setTick((p) => p + 1)
      setActive((p) => (p + 1) % stations.length)
    }, 650)
    return () => clearInterval(i)
  }, [])

  const vbW = 920
  const vbH = 240
  const stationW = 130
  const stationH = 80
  const gap = 50
  const rowY = 120
  const totalW = stations.length * stationW + (stations.length - 1) * gap
  const startX = (vbW - totalW) / 2

  return (
    <section id="system" className="relative border-b-2 border-ink bg-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-paper opacity-50" />

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-12 gap-0 border-b-2 border-ink">
        <div className="col-span-12 border-b-2 border-ink px-4 py-4 md:col-span-3 md:border-b-0 md:border-r-2 md:px-8">
          <div className="flex items-center gap-3">
            <AuGear size={22} teeth={10} direction="fast" color="var(--red)" />
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ink">
              {t("system.eyebrow", "Final · The System, live")}
            </p>
          </div>
        </div>
        <div className="col-span-12 px-4 py-8 md:col-span-9 md:px-8 md:py-10">
          <h2
            className="text-balance font-sans font-semibold leading-[0.9] tracking-[-0.04em] text-ink"
            style={{ fontSize: "clamp(2rem, 5.6vw, 4.75rem)" }}
          >
            {t("system.headline_1", "Watch it")}{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{t("system.headline_2", "unify")}</span>
              <span aria-hidden className="absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.38em] bg-lime" />
            </span>
            .
            <br />
            <span className="text-ink/60">
              {t("system.subline", "A live view of the plane.")}
            </span>
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-base font-medium leading-[1.35] text-ink/80 md:text-lg">
            {t(
              "system.body",
              "One domain. One control plane. Every signal in — one coordinated output out. This is what the name literally does.",
            )}
          </p>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-2 border-b-2 border-ink md:grid-cols-4">
        <StatCell
          label={t("system.stat_1", "Events / sec")}
          value={pad(eps, 5).trim()}
          trend="↑"
          accent="text-red"
          delayMs={0}
        />
        <StatCell
          label={t("system.stat_2", "Agents online")}
          value="06 / 06"
          live
          delayMs={120}
        />
        <StatCell
          label={t("system.stat_3", "Uptime · 30d")}
          value="99.97%"
          delayMs={240}
        />
        <StatCell
          label={t("system.stat_4", "Processed · total")}
          value={total.toLocaleString("en-US")}
          mono
          delayMs={360}
        />
      </div>

      <div
        className="reveal reveal-up relative mx-auto max-w-[1440px] border-b-2 border-ink bg-card"
        style={{ ["--reveal-delay" as string]: "200ms" }}
      >
        <div className="flex items-center justify-between gap-4 border-b-2 border-ink px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <span className="relative inline-flex h-2 w-2">
              <span aria-hidden className="absolute inline-flex h-full w-full bg-red pulse-ring" />
              <span className="relative inline-flex h-2 w-2 bg-red" />
            </span>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink">
              system.status · ONLINE
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 sm:block">
              tick {String(tick).padStart(4, "0")}
            </p>
            <AuGear size={18} teeth={10} direction="fast" color="var(--ink)" />
            <AuGear size={18} teeth={10} direction="ccw" color="var(--red)" />
          </div>
        </div>

        <div className="relative px-4 py-8 md:px-8 md:py-10">
          <svg
            viewBox={`0 0 ${vbW} ${vbH}`}
            className="h-auto w-full"
            role="img"
            aria-label="Live automation pipeline"
          >
            <g stroke="var(--ink)" strokeOpacity="0.06" strokeWidth="1">
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`gv${i}`} x1={i * 48} y1={0} x2={i * 48} y2={vbH} />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`gh${i}`} x1={0} y1={i * 44} x2={vbW} y2={i * 44} />
              ))}
            </g>

            <line
              x1={startX}
              y1={40}
              x2={startX + totalW}
              y2={40}
              stroke="var(--ink)"
              strokeOpacity="0.2"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            <text
              x={startX}
              y={30}
              fontFamily="var(--font-mono)"
              fontSize="10"
              fontWeight="700"
              fill="var(--ink)"
              letterSpacing="1.5"
              opacity="0.7"
            >
              PIPELINE
            </text>
            <text
              x={startX + totalW}
              y={30}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="10"
              fontWeight="700"
              fill="var(--ink)"
              letterSpacing="1.5"
              opacity="0.7"
            >
              /one-system
            </text>

            {stations.slice(0, -1).map((_, i) => {
              const x1 = startX + (i + 1) * stationW + i * gap
              const x2 = x1 + gap
              const pathId = `au-seg-${i}`
              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={rowY + stationH / 2}
                    x2={x2}
                    y2={rowY + stationH / 2}
                    stroke="var(--ink)"
                    strokeOpacity="0.55"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                    className="dash-flow"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                  <path
                    id={pathId}
                    d={`M ${x1} ${rowY + stationH / 2} L ${x2} ${rowY + stationH / 2}`}
                    fill="none"
                    stroke="none"
                  />
                  {[0, 0.4, 0.8].map((delay, k) => (
                    <g key={k}>
                      <rect width="8" height="8" y="-4" fill="var(--red)" stroke="var(--ink)" strokeWidth="1">
                        <animateMotion
                          dur="1.6s"
                          repeatCount="indefinite"
                          begin={`${i * 0.15 + delay}s`}
                          rotate="auto"
                        >
                          <mpath href={`#${pathId}`} />
                        </animateMotion>
                      </rect>
                    </g>
                  ))}
                </g>
              )
            })}

            {stations.map((s, i) => {
              const x = startX + i * (stationW + gap)
              const isActive = active === i
              return (
                <g key={s.id}>
                  <text
                    x={x + stationW / 2}
                    y={rowY - 12}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="9"
                    fontWeight="700"
                    fill="var(--ink)"
                    opacity="0.55"
                    letterSpacing="1.3"
                  >
                    {s.hint}
                  </text>

                  {isActive && (
                    <rect
                      x={x + 4}
                      y={rowY + 4}
                      width={stationW}
                      height={stationH}
                      fill="var(--ink)"
                      opacity="0.2"
                    />
                  )}

                  <rect
                    x={x}
                    y={rowY}
                    width={stationW}
                    height={stationH}
                    fill={isActive ? "var(--lime)" : "var(--paper)"}
                    stroke="var(--ink)"
                    strokeWidth="2"
                  />
                  <rect
                    x={x + 8}
                    y={rowY + 8}
                    width="20"
                    height="14"
                    fill="var(--ink)"
                  />
                  <text
                    x={x + 18}
                    y={rowY + 18}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="9"
                    fontWeight="700"
                    fill="var(--lime)"
                    letterSpacing="1"
                  >
                    {s.id}
                  </text>
                  <text
                    x={x + stationW / 2}
                    y={rowY + 48}
                    textAnchor="middle"
                    fontFamily="var(--font-sans)"
                    fontSize="16"
                    fontWeight="700"
                    fill="var(--ink)"
                    letterSpacing="-0.5"
                  >
                    {s.name}
                  </text>
                  <line
                    x1={x + 8}
                    y1={rowY + stationH - 10}
                    x2={x + stationW - 22}
                    y2={rowY + stationH - 10}
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={x + stationW - 14}
                    cy={rowY + stationH - 10}
                    r="3"
                    fill="var(--red)"
                  >
                    {isActive && (
                      <animate
                        attributeName="r"
                        values="3;5;3"
                        dur="0.9s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                </g>
              )
            })}

            <g>
              <line
                x1={startX + totalW}
                y1={rowY + stationH / 2}
                x2={vbW - 20}
                y2={rowY + stationH / 2}
                stroke="var(--ink)"
                strokeWidth="2"
                strokeDasharray="6 5"
                className="dash-flow"
              />
              <polygon
                points={`${vbW - 20},${rowY + stationH / 2} ${vbW - 30},${rowY + stationH / 2 - 6} ${vbW - 30},${rowY + stationH / 2 + 6}`}
                fill="var(--ink)"
              />
            </g>

            <text
              x={startX}
              y={rowY + stationH + 50}
              fontFamily="var(--font-mono)"
              fontSize="10"
              fontWeight="700"
              fill="var(--ink)"
              opacity="0.55"
              letterSpacing="1.5"
            >
              PROCESSED · {total.toLocaleString("en-US")}
            </text>
            <text
              x={startX + totalW}
              y={rowY + stationH + 50}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="10"
              fontWeight="700"
              fill="var(--red)"
              letterSpacing="1.5"
            >
              STAGE · {stations[active].name}
            </text>
          </svg>
        </div>

        <div className="relative overflow-hidden border-t-2 border-ink bg-ink py-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent" />

          <div
            className="ticker-track flex w-max items-center gap-3 px-4"
            style={{ ["--ticker-duration" as string]: "60s" }}
            aria-hidden="true"
          >
            {[...tasks, ...tasks, ...tasks].map((tk, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border-2 border-paper/30 bg-ink px-3 py-2"
              >
                <span
                  className={`border-2 border-ink px-1.5 py-[2px] font-mono text-[9px] font-bold uppercase tracking-[0.14em] ${stateStyle(
                    tk.state,
                  )}`}
                >
                  {tk.state}
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-paper/60">
                  {tk.id}
                </span>
                <span className="font-mono text-[11px] text-paper">
                  {tk.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCell({
  label,
  value,
  trend,
  accent,
  live,
  mono,
  delayMs = 0,
}: {
  label: string
  value: string
  trend?: string
  accent?: string
  live?: boolean
  mono?: boolean
  delayMs?: number
}) {
  return (
    <div
      style={{ ["--reveal-delay" as string]: `${delayMs}ms` }}
      className="reveal reveal-up relative flex flex-col gap-2 border-b-2 border-ink bg-paper px-4 py-5 last:border-b-0 md:border-b-0 md:border-r-2 md:last:border-r-0 md:px-6 md:py-6 [&:nth-child(2n)]:border-b-2 md:[&:nth-child(2n)]:border-b-0"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
          {label}
        </p>
        {live && (
          <span className="relative inline-flex h-2 w-2">
            <span aria-hidden className="absolute inline-flex h-full w-full bg-red pulse-ring" />
            <span className="relative inline-flex h-2 w-2 bg-red" />
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={`nums ${mono ? "font-mono" : "font-sans"} font-bold leading-none tracking-[-0.02em] text-ink ${accent ?? ""}`}
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
        >
          {value}
        </span>
        {trend && (
          <span className="font-mono text-xs font-bold text-red">{trend}</span>
        )}
      </div>
    </div>
  )
}
