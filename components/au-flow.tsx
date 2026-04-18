"use client"

import { AuDiagram } from "./au-diagram"
import { AuGear } from "./au-gear"
import { useCopy } from "./content-provider"

export function AuFlow() {
  const t = useCopy()
  const points: [string, string][] = [
    ["01", t("flow.point_1", "One URL. One spelling. One story.")],
    ["02", t("flow.point_2", "No hyphens, numbers, or plurals.")],
    ["03", t("flow.point_3", "Literal meaning = your product promise.")],
  ]

  return (
    <section
      id="flow"
      className="relative overflow-hidden border-b-2 border-ink bg-paper"
    >
      <div className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-[1440px] items-baseline justify-between px-4 py-3 md:px-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
            {t("flow.section_label", "§ 01 / The Thesis")}
          </p>
          <p className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink md:block">
            {t("flow.section_hint", "fragmented → unified")}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-12 px-4 md:px-8">
        {/* LEFT copy */}
        <div className="reveal reveal-left col-span-12 py-12 md:col-span-5 md:border-r-2 md:border-ink md:py-20 md:pr-10">
          <div className="flex items-center gap-3">
            <AuGear size={28} teeth={10} direction="cw" className="text-red" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
              {t("flow.eyebrow", "Automation, unified")}
            </span>
          </div>

          <h2
            className="mt-6 text-balance font-sans font-semibold leading-[0.92] tracking-[-0.04em] text-ink"
            style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
          >
            {t(
              "flow.headline",
              "Six broken stacks — one name that owns the category.",
            )}
          </h2>

          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-ink md:text-lg">
            {t(
              "flow.body",
              "Every AI team today is stitching agents, models and tools with duct tape. The next decade belongs to the platform that makes them feel like one system — automatic and unified. This URL says that out loud.",
            )}
          </p>

          <ul className="mt-10 space-y-3">
            {points.map(([n, label], i) => (
              <li
                key={n}
                style={{ ["--reveal-delay" as string]: `${i * 120 + 250}ms` }}
                className="reveal reveal-up flex items-baseline gap-4 border-b border-ink/20 pb-3"
              >
                <span className="border-2 border-ink bg-ink px-1.5 py-[2px] font-mono text-[10px] font-bold tracking-[0.15em] text-lime">
                  {n}
                </span>
                <span className="font-sans text-base font-medium text-ink md:text-lg">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT diagram */}
        <div
          className="reveal reveal-right col-span-12 overflow-hidden border-t-2 border-ink py-10 md:col-span-7 md:border-t-0 md:py-20 md:pl-10"
          style={{ ["--reveal-delay" as string]: "150ms" }}
        >
          <div className="relative border-2 border-ink bg-paper p-3 md:p-5">
            {/* corner brackets */}
            <span aria-hidden className="pointer-events-none absolute -left-[2px] -top-[2px] h-4 w-4 border-l-2 border-t-2 border-red" />
            <span aria-hidden className="pointer-events-none absolute -right-[2px] -top-[2px] h-4 w-4 border-r-2 border-t-2 border-red" />
            <span aria-hidden className="pointer-events-none absolute -bottom-[2px] -left-[2px] h-4 w-4 border-b-2 border-l-2 border-red" />
            <span aria-hidden className="pointer-events-none absolute -bottom-[2px] -right-[2px] h-4 w-4 border-b-2 border-r-2 border-red" />

            {/* diagram frame top bar */}
            <div className="mb-3 flex items-center justify-between border-b-2 border-ink pb-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
                /diagram · fig-01
              </span>
              <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink">
                <span className="relative inline-flex h-2 w-2">
                  <span aria-hidden className="absolute inline-flex h-full w-full bg-red pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 bg-red" />
                </span>
                Live
              </div>
            </div>

            <AuDiagram variant="light" />

            <div className="mt-3 flex items-center justify-between border-t-2 border-ink pt-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink">
                6 inputs → 1 core
              </span>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink">
                throughput: ∞
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
