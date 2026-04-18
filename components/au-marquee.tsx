"use client"

import { AuGear } from "./au-gear"
import { useCopy } from "./content-provider"

const DEFAULT_ITEMS = [
  "AUTOMATE",
  "UNIFY",
  "ORCHESTRATE",
  "FEDERATE",
  "COMPOSE",
  "AGENT-NATIVE",
  "MULTI-MODEL",
  "INTEROPERABLE",
  "SELF-DIRECTING",
  "SOVEREIGN",
]

export function AuMarquee() {
  const t = useCopy()
  const raw = t("marquee.items", DEFAULT_ITEMS.join(","))
  const items =
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean).length > 0
      ? raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : DEFAULT_ITEMS

  const loop = [...items, ...items, ...items]
  return (
    <div
      className="relative overflow-hidden border-b-2 border-ink bg-ink py-5"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent" />

      <div
        className="ticker-track flex w-max items-center gap-8 whitespace-nowrap"
        style={{ ["--ticker-duration" as string]: "55s" }}
      >
        {loop.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-sans text-2xl font-bold tracking-[-0.02em] text-paper md:text-4xl"
          >
            {w}
            <span className="inline-flex items-center justify-center text-red">
              <AuGear
                size={28}
                teeth={10}
                direction={i % 2 === 0 ? "cw" : "ccw"}
                color="currentColor"
              />
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
