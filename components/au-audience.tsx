"use client"

import { AuGear } from "./au-gear"
import { useCopy } from "./content-provider"

export function AuAudience() {
  const t = useCopy()
  const buyers = [
    {
      tag: "A",
      title: t("audience.buyer_a_title", "AI Orchestration Platform"),
      body: t(
        "audience.buyer_a_body",
        "A control plane for agents, tools and models across every vendor. The name is the pitch.",
      ),
    },
    {
      tag: "B",
      title: t("audience.buyer_b_title", "Agentic Infrastructure Startup"),
      body: t(
        "audience.buyer_b_body",
        "One brand, one URL — pre-seed deck to Series C announcement. Zero re-branding tax.",
      ),
    },
    {
      tag: "C",
      title: t("audience.buyer_c_title", "Multi-Model Gateway"),
      body: t(
        "audience.buyer_c_body",
        "Unify OpenAI, Anthropic, xAI, open-source behind one contract. Your users never switch.",
      ),
    },
    {
      tag: "D",
      title: t("audience.buyer_d_title", "Enterprise AI Consultancy"),
      body: t(
        "audience.buyer_d_body",
        "Position above the implementation crowd. A name clients quote in the boardroom.",
      ),
    },
    {
      tag: "E",
      title: t("audience.buyer_e_title", "Autonomous Robotics OS"),
      body: t(
        "audience.buyer_e_body",
        "Literal reading: auto + unified. A fleet operating as a single mind.",
      ),
    },
    {
      tag: "F",
      title: t("audience.buyer_f_title", "Portfolio / Holding"),
      body: t(
        "audience.buyer_f_body",
        "Park it. Own the category phrase before competitors define it. Resale upside obvious.",
      ),
    },
  ]

  return (
    <section id="buyers" className="relative overflow-hidden border-b-2 border-ink bg-paper">
      <div className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-[1440px] items-baseline justify-between px-4 py-3 md:px-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
            {t("audience.section_label", "§ 03 / Intended Buyer")}
          </p>
          <p className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink md:block">
            {t("audience.section_hint", "six plausible owners")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-20">
        <div className="reveal reveal-up flex items-start gap-6">
          <div className="hidden pt-3 md:block">
            <AuGear size={44} teeth={12} direction="cw" className="text-ink" />
          </div>
          <h2
            className="max-w-4xl text-balance font-sans font-semibold leading-[0.95] tracking-[-0.04em] text-ink"
            style={{ fontSize: "clamp(2rem, 5vw, 4.25rem)" }}
          >
            {t(
              "audience.headline",
              "Built for the team that wants the category-defining URL before anyone else thinks to ask.",
            )}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 border-2 border-ink bg-paper md:grid-cols-2 lg:grid-cols-3">
          {buyers.map((b, i) => {
            const col = i % 3
            const row = Math.floor(i / 3)
            return (
              <article
                key={b.tag}
                style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                className={[
                  "reveal reveal-up group relative bg-paper p-6 transition-colors hover:bg-lime md:p-8",
                  i % 2 === 1 ? "border-t-2 border-ink md:border-l-2 md:border-t-0" : "",
                  i > 0 && i % 2 === 0 ? "border-t-2 border-ink md:border-t-0" : "",
                  col > 0 ? "lg:border-l-2 lg:border-ink lg:border-t-0" : "lg:border-l-0",
                  row > 0 ? "lg:border-t-2 lg:border-ink" : "",
                ].join(" ")}
              >
                <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 border-ink opacity-0 transition-opacity group-hover:opacity-100" />
                <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2 border-ink opacity-0 transition-opacity group-hover:opacity-100" />
                <span aria-hidden className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-ink opacity-0 transition-opacity group-hover:opacity-100" />
                <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-ink opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="flex items-center justify-between">
                  <span className="border-2 border-ink bg-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-paper">
                    Type {b.tag}
                  </span>
                  <div className="flex items-center gap-2">
                    <AuGear
                      size={18}
                      teeth={10}
                      direction={i % 2 === 0 ? "cw" : "ccw"}
                      className="text-ink opacity-50 transition-opacity group-hover:opacity-100"
                    />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
                      0{i + 1}/06
                    </span>
                  </div>
                </div>
                <h3
                  className="mt-8 font-sans font-semibold leading-[0.98] tracking-[-0.03em] text-ink"
                  style={{ fontSize: "clamp(1.25rem, 2vw, 1.7rem)" }}
                >
                  {b.title}
                </h3>
                <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink/80">
                  {b.body}
                </p>
                <div className="mt-6 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
                  <span>fit → high</span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
