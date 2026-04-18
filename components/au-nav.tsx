"use client"

import { AuGear } from "./au-gear"
import { AuMagnetic } from "./au-magnetic"

export function AuNav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 md:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex items-center gap-2 border-2 border-ink bg-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-paper">
            <AuGear size={12} teeth={8} direction="fast" color="var(--lime)" />
            LOT / 001
          </span>
          <span className="hidden font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink sm:inline">
            autounified.com
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {[
            ["Thesis", "#flow"],
            ["Manifesto", "#manifesto"],
            ["Buyers", "#buyers"],
            ["Specs", "#specs"],
            ["System", "#system"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="u-draw font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink md:flex">
            <span className="relative inline-flex h-2 w-2">
              <span aria-hidden className="absolute inline-flex h-full w-full bg-red pulse-ring" />
              <span className="relative inline-flex h-2 w-2 bg-red" />
            </span>
            Available
          </span>
          <AuMagnetic strength={0.22}>
            <a
              href="#acquire"
              className="shine group flex items-center gap-1 border-2 border-ink bg-ink px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-red"
            >
              <span className="relative z-10">Buy → $1,000</span>
            </a>
          </AuMagnetic>
        </div>
      </div>
    </header>
  )
}
