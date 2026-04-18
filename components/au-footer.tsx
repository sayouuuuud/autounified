"use client"

import { AuGear } from "./au-gear"

export function AuFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="absolute inset-0 grid-paper-dark opacity-40" />

      <div className="relative mx-auto max-w-[1440px] px-4 md:px-8">
        {/* flow rail */}
        <div
          aria-hidden
          className="flex items-center gap-4 border-b-2 border-paper/15 py-6"
        >
          <AuGear size={24} teeth={10} direction="cw" className="text-lime" />
          <div className="relative h-[2px] flex-1 overflow-hidden">
            <svg className="h-full w-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="var(--paper)"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeDasharray="8 6"
                className="dash-flow"
              />
            </svg>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
            end · transmission
          </span>
          <div className="relative h-[2px] flex-1 overflow-hidden">
            <svg className="h-full w-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="var(--paper)"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeDasharray="8 6"
                className="dash-flow"
              />
            </svg>
          </div>
          <AuGear size={24} teeth={10} direction="ccw" className="text-red" />
        </div>

        {/* manifesto one-liner */}
        <div className="border-b-2 border-paper/15 py-14 md:py-20">
          <p
            className="reveal reveal-up max-w-5xl text-balance font-sans font-semibold leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize: "clamp(1.6rem, 3.8vw, 3rem)" }}
          >
            Good names are bought by the people who move{" "}
            <span className="bg-lime px-2 text-ink">first</span>. If you&apos;re
            still on this page, you&apos;re not first — but you could be second.
          </p>
        </div>

        {/* meta grid */}
        <div className="grid grid-cols-12 gap-6 border-b-2 border-paper/15 py-10">
          <div className="col-span-12 md:col-span-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
              Contact
            </p>
            <a
              href="mailto:sales@autounified.com"
              className="mt-3 block break-all font-sans text-xl font-semibold tracking-[-0.02em] text-paper transition-colors hover:text-lime md:text-2xl"
            >
              sales@autounified.com
            </a>
          </div>
          <div className="col-span-6 md:col-span-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
              Process
            </p>
            <ul className="mt-3 space-y-1 font-mono text-sm text-paper">
              <li>Escrow.com</li>
              <li>Wire · Wise · ACH</li>
              <li>Same-day transfer</li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
              Sections
            </p>
            <ul className="mt-3 space-y-1 font-mono text-sm">
              {[
                ["Thesis", "#flow"],
                ["Manifesto", "#manifesto"],
                ["Buyers", "#buyers"],
                ["Specs", "#specs"],
                ["System", "#system"],
                ["Acquire", "#acquire"],
              ].map(([l, h]) => (
                <li key={h}>
                  <a href={h} className="text-paper transition-colors hover:text-lime">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* giant wordmark — SVG scales to always fit the full domain incl. .com */}
        <div className="reveal reveal-clip relative w-full py-8">
          <svg
            viewBox="0 0 1640 200"
            preserveAspectRatio="xMidYMid meet"
            className="h-auto w-full"
            aria-hidden="true"
          >
            <text
              x="0"
              y="165"
              fontFamily="var(--font-sans)"
              fontWeight="600"
              fontSize="200"
              letterSpacing="-8"
              fill="var(--paper)"
            >
              autounified<tspan fill="var(--red)">.com</tspan>
            </text>
          </svg>
        </div>

        {/* legal */}
        <div className="grid grid-cols-12 gap-4 border-t-2 border-paper/15 py-5">
          <p className="col-span-12 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60 md:col-span-6">
            © 2026 — Private listing. Not affiliated with any trademark holder.
          </p>
          <p className="col-span-12 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60 md:col-span-6 md:text-right">
            Lot 001 / Ed. I of I
          </p>
        </div>
      </div>
    </footer>
  )
}
