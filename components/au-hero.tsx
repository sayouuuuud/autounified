"use client"

import { AuGear } from "./au-gear"
import { AuMagnetic } from "./au-magnetic"
import { AuCountUp } from "./au-count-up"
import { useCopy } from "./content-provider"

export function AuHero() {
  const t = useCopy()
  const priceNumber = parseInt(t("site.price_usd", "1000"), 10) || 1000

  const metaStrip: [string, string][] = [
    [t("hero.meta_1_label", "001"), t("hero.meta_1_value", "Premium .com")],
    [t("hero.meta_2_label", "TLD"), t("hero.meta_2_value", ".com · gTLD")],
    [t("hero.meta_3_label", "LEN"), t("hero.meta_3_value", "12 chars · 0 hyphens")],
    [t("hero.meta_4_label", "LOT"), t("hero.meta_4_value", "Edition I of I")],
  ]

  return (
    <section id="top" className="relative overflow-hidden border-b-2 border-ink bg-lime">
      {/* faint grid behind hero */}
      <div aria-hidden className="absolute inset-0 grid-paper opacity-50" />

      {/* giant background gear — atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 opacity-[0.08] md:-right-48 md:-top-32"
      >
        <AuGear size={560} teeth={16} direction="ccw" color="var(--ink)" />
      </div>

      {/* meta strip */}
      <div className="relative border-b-2 border-ink bg-lime/80 backdrop-blur">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
          {metaStrip.map(([label, value], i) => (
            <div
              key={`${label}-${i}`}
              style={{ ["--reveal-delay" as string]: `${i * 50}ms` }}
              className={[
                "reveal reveal-down flex items-center gap-3 px-4 py-3 md:px-6",
                i > 0 ? "border-l-2 border-ink" : "",
                // on mobile, second row (i >= 2) gets a top border
                i >= 2 ? "border-t-2 border-ink md:border-t-0" : "",
              ].join(" ")}
            >
              <span className="border-2 border-ink bg-ink px-1.5 py-[2px] font-mono text-[9px] font-bold tracking-[0.18em] text-lime">
                {label}
              </span>
              <span className="truncate font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* main */}
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-12 gap-0">
        {/* LEFT — headline */}
        <div className="col-span-12 px-4 py-12 md:col-span-8 md:border-r-2 md:border-ink md:px-8 md:py-20 md:pr-10">
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-[2px] w-8 bg-ink md:w-14" />
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ink">
              {t("hero.eyebrow", "Premium domain — for sale")}
            </p>
            <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
              <span className="relative inline-flex h-2 w-2 items-center justify-center">
                <span aria-hidden className="absolute inline-flex h-full w-full bg-red pulse-ring" />
                <span className="relative inline-flex h-2 w-2 bg-red" />
              </span>
              {t("hero.live_label", "Live")}
            </span>
          </div>

          <h1
            className="reveal reveal-up mt-6 break-words font-sans font-semibold leading-[0.82] tracking-[-0.055em] text-ink"
            style={{ fontSize: "clamp(2.75rem, 11vw, 12rem)", ["--reveal-delay" as string]: "80ms" }}
          >
            <span className="inline-flex items-center gap-3 md:gap-6">
              <span>{t("hero.headline_part_1", "auto")}</span>
              <AuGear
                size={96}
                teeth={12}
                direction="fast"
                color="var(--ink)"
                className="shrink-0"
              />
            </span>
            <span className="italic">{t("hero.headline_part_2", "unified")}</span>
            <span className="text-red">{t("hero.headline_part_3", ".com")}</span>
          </h1>

          <p
            className="reveal reveal-up mt-8 max-w-2xl text-pretty font-sans font-medium leading-[1.2] tracking-[-0.02em] text-ink"
            style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.9rem)", ["--reveal-delay" as string]: "220ms" }}
          >
            {t(
              "hero.sub",
              "A one-word .com for the era when every agent, model & workflow becomes one automated system.",
            )}
          </p>

          <div
            className="reveal reveal-up mt-10 flex flex-wrap items-center gap-3"
            style={{ ["--reveal-delay" as string]: "340ms" }}
          >
            <AuMagnetic strength={0.35}>
              <a
                href="#acquire"
                className="shine group inline-flex items-center gap-3 border-2 border-ink bg-red px-5 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink"
              >
                <span className="relative z-10">
                  {t("hero.cta_primary", "Acquire for $1,000")}
                </span>
                <span aria-hidden className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              </a>
            </AuMagnetic>
            <AuMagnetic strength={0.25}>
              <a
                href="#flow"
                className="shine inline-flex items-center gap-3 border-2 border-ink bg-paper px-5 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <span className="relative z-10">
                  {t("hero.cta_secondary", "See the Thesis")}
                </span>
                <span aria-hidden className="relative z-10">↓</span>
              </a>
            </AuMagnetic>
          </div>
        </div>

        {/* RIGHT — price + terminal column */}
        <aside
          className="reveal reveal-right col-span-12 flex flex-col border-t-2 border-ink md:col-span-4 md:border-t-0"
          style={{ ["--reveal-delay" as string]: "120ms" }}
        >
          {/* price */}
          <div className="relative overflow-hidden border-b-2 border-ink bg-ink p-6 md:p-8">
            <div aria-hidden className="absolute inset-0 grid-paper-dark opacity-60" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
                  {t("hero.price_label", "Price · one-time")}
                </p>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime/60">
                  {t("hero.price_tag", "/LOT·001")}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-paper">$</span>
                <AuCountUp
                  to={priceNumber}
                  duration={1400}
                  className="nums font-sans font-bold leading-none tracking-[-0.05em] text-paper"
                  style={{ fontSize: "clamp(3.25rem, 6.5vw, 5rem)" }}
                />
                <span className="ml-1 font-mono text-xs font-bold uppercase text-paper/60">
                  USD
                </span>
              </div>
              <p className="mt-3 font-mono text-[11px] text-paper/70">
                {t("hero.price_note", "No broker fee. Buyer covers escrow (~1.5%).")}
              </p>
            </div>
          </div>

          {/* terminal / whois */}
          <div className="relative flex-1 overflow-hidden bg-paper p-6 md:p-8">
            {/* scan bar */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-red/70 scan"
            />
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
                {`$ whois ${t("site.domain", "autounified.com")}`}
              </p>
              <div className="flex items-center gap-1">
                <span aria-hidden className="h-2 w-2 bg-ink" />
                <span aria-hidden className="h-2 w-2 bg-ink" />
                <span aria-hidden className="h-2 w-2 bg-red tick" />
              </div>
            </div>

            <pre className="mt-4 whitespace-pre font-mono text-[11px] leading-[1.8] text-ink/80">
              {`domain.........${t("site.domain", "autounified.com")}
registrar......Namecheap
tld............com (gTLD)
hyphens........0
digits.........0
tm_conflict....none
status.........`}
              <span className="ml-0 inline-flex h-3 w-2 bg-ink align-middle cursor" />
            </pre>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
                <span className="relative inline-flex h-2 w-2">
                  <span aria-hidden className="absolute inline-flex h-full w-full bg-red pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 bg-red" />
                </span>
                {t("hero.whois_status", "Listed — ready to transfer")}
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
                /OK
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
