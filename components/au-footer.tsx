"use client"

import { AuGear } from "./au-gear"
import { useCopy } from "./content-provider"

export function AuFooter() {
  const t = useCopy()
  const salesEmail = t("site.sales_email", "sales@autounified.com")
  const domain = t("site.domain", "autounified.com")

  const sectionLinks: [string, string][] = [
    [t("nav.link_thesis", "Thesis"), "#flow"],
    [t("nav.link_manifesto", "Manifesto"), "#manifesto"],
    [t("nav.link_buyers", "Buyers"), "#buyers"],
    [t("nav.link_specs", "Specs"), "#specs"],
    [t("nav.link_system", "System"), "#system"],
    ["Acquire", "#acquire"],
  ]

  // Split domain for the giant SVG wordmark so the .com color stays red.
  const [domainHead, domainTld] = splitDomain(domain)

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
            {t(
              "footer.manifesto",
              "Good names are bought by the people who move first. If you're still on this page, you're not first — but you could be second.",
            )}
          </p>
        </div>

        {/* meta grid */}
        <div className="grid grid-cols-12 gap-6 border-b-2 border-paper/15 py-10">
          <div className="col-span-12 md:col-span-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
              {t("footer.contact_label", "Contact")}
            </p>
            <a
              href={`mailto:${salesEmail}`}
              className="mt-3 block break-all font-sans text-xl font-semibold tracking-[-0.02em] text-paper transition-colors hover:text-lime md:text-2xl"
            >
              {salesEmail}
            </a>
          </div>
          <div className="col-span-6 md:col-span-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
              {t("footer.process_label", "Process")}
            </p>
            <ul className="mt-3 space-y-1 font-mono text-sm text-paper">
              <li>{t("footer.process_1", "Escrow.com")}</li>
              <li>{t("footer.process_2", "Wire · Wise · ACH")}</li>
              <li>{t("footer.process_3", "Same-day transfer")}</li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
              {t("footer.sections_label", "Sections")}
            </p>
            <ul className="mt-3 space-y-1 font-mono text-sm">
              {sectionLinks.map(([l, h]) => (
                <li key={h}>
                  <a href={h} className="text-paper transition-colors hover:text-lime">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* giant wordmark */}
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
              {domainHead}
              <tspan fill="var(--red)">{domainTld}</tspan>
            </text>
          </svg>
        </div>

        {/* legal */}
        <div className="grid grid-cols-12 gap-4 border-t-2 border-paper/15 py-5">
          <p className="col-span-12 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60 md:col-span-6">
            {t(
              "footer.copyright",
              "© 2026 — Private listing. Not affiliated with any trademark holder.",
            )}
          </p>
          <p className="col-span-12 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60 md:col-span-6 md:text-right">
            {t("footer.lot", "Lot 001 / Ed. I of I")}
          </p>
        </div>
      </div>
    </footer>
  )
}

function splitDomain(domain: string): [string, string] {
  const idx = domain.lastIndexOf(".")
  if (idx <= 0) return [domain, ""]
  return [domain.slice(0, idx), domain.slice(idx)]
}
