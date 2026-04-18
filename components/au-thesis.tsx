"use client"

import { AuGear } from "./au-gear"

const points = [
  {
    n: "01",
    h: "Every AI stack is a mess.",
    p: "Dozens of models. Thousands of tools. Pipelines that break on Tuesdays. The winning product of the decade will make it feel like one thing.",
  },
  {
    n: "02",
    h: "Autonomy without unity is chaos.",
    p: "Agents that act on their own are only valuable when they speak the same language, share memory and answer to a single system of record.",
  },
  {
    n: "03",
    h: "The URL is the flag.",
    p: "You can engineer category leadership, but you can only buy the name for it once. autounified.com is the flag — said out loud, it sells itself.",
  },
]

export function AuThesis() {
  return (
    <section id="manifesto" className="relative overflow-hidden border-b-2 border-ink bg-paper">
      <div className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-[1440px] items-baseline justify-between px-4 py-3 md:px-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
            § 02 / Manifesto
          </p>
          <p className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink md:block">
            why this name, why now
          </p>
        </div>
      </div>

      {/* AUTO / UNIFIED split */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 px-4 md:px-8">
        <div className="reveal reveal-left relative col-span-12 py-12 md:col-span-6 md:border-r-2 md:border-ink md:py-20 md:pr-12">
          <div className="flex items-center gap-3">
            <AuGear size={22} teeth={10} direction="cw" className="text-red" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
              /prefix — auto
            </p>
          </div>
          <h3
            className="mt-4 font-sans font-semibold leading-[0.85] tracking-[-0.05em] text-ink"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            auto
          </h3>
          <p className="mt-6 max-w-md text-pretty text-base font-medium leading-relaxed text-ink md:text-lg">
            Greek <em>autós</em> — self. In 2026 it no longer means cars. It
            means <span className="bg-lime px-1.5">systems that act</span>{" "}
            without waiting to be told. Agents. Decisions at the speed of
            inference.
          </p>
        </div>

        <div
          className="reveal reveal-right relative col-span-12 border-t-2 border-ink py-12 md:col-span-6 md:border-t-0 md:py-20 md:pl-12"
          style={{ ["--reveal-delay" as string]: "180ms" }}
        >
          <div className="flex items-center gap-3">
            <AuGear size={22} teeth={10} direction="ccw" className="text-red" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
              /suffix — unified
            </p>
          </div>
          <h3
            className="mt-4 font-sans font-semibold italic leading-[0.85] tracking-[-0.05em] text-ink"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            unified
          </h3>
          <p className="mt-6 max-w-md text-pretty text-base font-medium leading-relaxed text-ink md:text-lg">
            The layer that makes every model, tool & agent feel like{" "}
            <span className="bg-lime px-1.5">one thing</span>. Orchestration.
            Interoperability. A single surface for the many.
          </p>
        </div>
      </div>

      {/* three-point manifesto */}
      <div className="border-t-2 border-ink">
        <div className="mx-auto grid max-w-[1440px] grid-cols-12 px-4 md:px-8">
          {points.map((pt, i) => (
            <article
              key={pt.n}
              style={{ ["--reveal-delay" as string]: `${i * 140}ms` }}
              className={[
                "reveal reveal-up relative col-span-12 py-10 md:col-span-4 md:py-16",
                i > 0 ? "border-t-2 border-ink md:border-l-2 md:border-t-0 md:pl-10" : "md:pr-10",
              ].join(" ")}
            >
              <div className="flex items-baseline gap-3">
                <span className="border-2 border-ink bg-ink px-2 py-[2px] font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-lime">
                  {pt.n}
                </span>
                <span className="h-[2px] flex-1 bg-ink" />
                <AuGear size={18} teeth={10} direction={i % 2 === 0 ? "cw" : "ccw"} className="text-ink" />
              </div>
              <h3
                className="mt-6 text-balance font-sans font-semibold leading-[0.95] tracking-[-0.03em] text-ink"
                style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.5rem)" }}
              >
                {pt.h}
              </h3>
              <p className="mt-5 text-pretty text-base leading-relaxed text-ink md:text-[17px]">
                {pt.p}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
