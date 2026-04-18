"use client"

import { AuGear } from "./au-gear"

const specs: [string, string][] = [
  ["Domain", "autounified.com"],
  ["Top-level domain", ".com"],
  ["Characters", "12"],
  ["Syllables", "5 — au·to·u·ni·fied"],
  ["Hyphens", "0"],
  ["Numerals", "0"],
  ["Pronunciation", "/ˈɔːtoʊ juːnɪfaɪd/"],
  ["Semantic field", "AI · Agents · Orchestration"],
  ["Trademark conflict", "None on USPTO (verify at close)"],
  ["Transfer", "Escrow.com or registrar push"],
  ["Included", "Full registrant transfer + auth code"],
]

export function AuSpecs() {
  return (
    <section id="specs" className="relative overflow-hidden border-b-2 border-ink bg-paper">
      <div className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-[1440px] items-baseline justify-between px-4 py-3 md:px-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
            § 04 / Specification
          </p>
          <p className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink md:block">
            record sheet
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-12 px-4 md:px-8">
        {/* Big visual card */}
        <aside className="reveal reveal-left relative col-span-12 overflow-hidden bg-lime py-12 md:col-span-5 md:border-r-2 md:border-ink md:py-20 md:pr-8">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 text-ink opacity-[0.1]">
            <AuGear size={180} teeth={14} direction="cw" />
          </div>
          <div aria-hidden className="pointer-events-none absolute -left-14 bottom-4 text-ink opacity-[0.08]">
            <AuGear size={140} teeth={12} direction="ccw" />
          </div>

          <div className="relative flex items-center justify-between">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
              Certificate / AU-001
            </p>
            <span className="border-2 border-ink bg-ink px-2 py-[2px] font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-lime">
              Ed. I of I
            </span>
          </div>

          <div className="relative mt-10">
            <div
              className="font-sans font-semibold leading-[0.85] tracking-[-0.05em] text-ink"
              style={{ fontSize: "clamp(2.75rem, 7.5vw, 6.5rem)" }}
            >
              auto
            </div>
            <div
              className="font-sans font-semibold italic leading-[0.85] tracking-[-0.05em] text-ink"
              style={{ fontSize: "clamp(2.75rem, 7.5vw, 6.5rem)" }}
            >
              unified
            </div>
            <div
              className="mt-2 font-sans font-semibold leading-[0.85] tracking-[-0.05em] text-red"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}
            >
              .com
            </div>
          </div>

          <div className="relative mt-14 border-t-2 border-ink pt-6">
            <dl className="grid grid-cols-2 gap-y-3">
              <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
                Issued
              </dt>
              <dd className="text-right font-mono text-sm text-ink">04.2026</dd>
              <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
                Lot
              </dt>
              <dd className="text-right font-mono text-sm text-ink">AU-001</dd>
              <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
                Status
              </dt>
              <dd className="flex items-center justify-end gap-2 text-right font-mono text-sm font-bold text-red">
                <span className="relative inline-flex h-2 w-2">
                  <span aria-hidden className="absolute inline-flex h-full w-full bg-red pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 bg-red" />
                </span>
                AVAILABLE
              </dd>
            </dl>
          </div>
        </aside>

        {/* Spec table */}
        <div
          className="reveal reveal-right col-span-12 border-t-2 border-ink py-12 md:col-span-7 md:border-t-0 md:py-20 md:pl-10"
          style={{ ["--reveal-delay" as string]: "180ms" }}
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
              Technical.record
            </p>
            <AuGear size={22} teeth={10} direction="cw" className="text-ink" />
          </div>

          <dl className="mt-6 border-t-2 border-ink">
            {specs.map(([label, value], i) => (
              <div
                key={label}
                style={{ ["--reveal-delay" as string]: `${i * 55 + 250}ms` }}
                className="reveal reveal-up group grid grid-cols-12 items-baseline gap-x-4 border-b border-ink/40 py-4 transition-colors hover:bg-lime/60"
              >
                <dt className="col-span-5 flex items-baseline gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink md:col-span-4">
                  <span className="text-ink/40 nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </dt>
                <dd className="col-span-7 text-right font-sans text-[15px] font-medium text-ink md:col-span-8 md:text-base">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* barcode */}
          <div className="mt-10 flex items-end gap-[2px] overflow-hidden" aria-hidden="true">
            {Array.from({ length: 48 }).map((_, i) => (
              <span
                key={i}
                className="block bg-ink"
                style={{
                  width: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
                  height: 28 + ((i * 7) % 22),
                }}
              />
            ))}
            <span className="ml-3 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
              AU-001-2026
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
