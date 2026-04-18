"use client"

import { AuGear } from "./au-gear"
import { AuMagnetic } from "./au-magnetic"
import { AuCountUp } from "./au-count-up"
import { useCopy } from "./content-provider"

export function AuPrice() {
  const t = useCopy()
  const priceNumber = parseInt(t("site.price_usd", "1000"), 10) || 1000
  const buyHref = t(
    "site.buy_url",
    "mailto:sales@autounified.com?subject=Acquisition%20%E2%80%94%20autounified.com",
  )
  const questionHref = t(
    "site.question_url",
    "mailto:sales@autounified.com?subject=Question%20%E2%80%94%20autounified.com",
  )

  const steps: [string, string][] = [
    ["01", t("price.step_1", "You reach out. We confirm availability within the hour.")],
    ["02", t("price.step_2", "Escrow opened. You wire USD 1,000.")],
    ["03", t("price.step_3", "We push the domain. You control it before end of day.")],
  ]

  const features = [
    t("price.feature_1", "Ownership — 100% transferred"),
    t("price.feature_2", "Escrow.com — buyer & seller protected"),
    t("price.feature_3", "Transfer — usually same-day"),
    t("price.feature_4", "Support — free DNS migration help"),
  ]

  return (
    <section
      id="acquire"
      className="relative overflow-hidden border-b-2 border-ink bg-red text-paper"
    >
      <div aria-hidden className="absolute inset-0 grid-paper-dark opacity-40" />

      <div aria-hidden className="pointer-events-none absolute -left-10 top-20 text-paper opacity-10">
        <AuGear size={220} teeth={14} direction="cw" />
      </div>
      <div aria-hidden className="pointer-events-none absolute -right-10 -bottom-10 text-paper opacity-10">
        <AuGear size={260} teeth={14} direction="ccw" />
      </div>

      <div className="relative border-b-2 border-ink">
        <div className="mx-auto flex max-w-[1440px] items-baseline justify-between px-4 py-3 md:px-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper">
            {t("price.section_label", "§ 05 / Acquisition")}
          </p>
          <p className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper md:block">
            {t("price.section_hint", "one buyer · one wire · done")}
          </p>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-12 px-4 md:px-8">
        {/* Left — headline + process */}
        <div className="reveal reveal-left col-span-12 py-12 md:col-span-7 md:border-r-2 md:border-ink md:py-20 md:pr-10">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-paper">
            {t("price.eyebrow", "Buy it now")}
          </p>
          <h2
            className="mt-4 text-balance font-sans font-semibold leading-[0.88] tracking-[-0.05em]"
            style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)" }}
          >
            {t("price.headline", "A one-time acquisition. No renewals. No royalties. No catch.")}
          </h2>

          <p className="mt-8 max-w-xl text-pretty text-base leading-relaxed md:text-lg">
            {t(
              "price.body",
              "Transfer via Escrow.com (1.5% fee, paid by buyer) or direct push at your registrar — GoDaddy, Namecheap, Cloudflare, Dynadot. Funds clear, auth code sent. Usually same-day.",
            )}
          </p>

          <ol className="mt-12 space-y-0 border-t-2 border-ink">
            {steps.map(([n, txt], i) => (
              <li
                key={n}
                style={{ ["--reveal-delay" as string]: `${i * 140 + 200}ms` }}
                className="reveal reveal-up group grid grid-cols-12 items-baseline gap-4 border-b-2 border-ink py-5 transition-colors hover:bg-ink"
              >
                <span className="col-span-2 flex items-center gap-2 font-mono text-base font-bold md:col-span-1">
                  {n}
                </span>
                <span className="col-span-9 font-sans text-lg font-medium md:col-span-10 md:text-xl">
                  {txt}
                </span>
                <span aria-hidden className="col-span-1 text-right font-mono text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Right — big price card */}
        <aside className="col-span-12 border-t-2 border-ink py-12 md:col-span-5 md:border-t-0 md:py-20 md:pl-10">
          <div
            className="reveal reveal-scale sticky top-20 border-2 border-ink bg-paper text-ink shadow-[8px_8px_0_0_var(--ink)]"
            style={{ ["--reveal-delay" as string]: "200ms" }}
          >
            <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-6 py-3">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
                {t("price.card_header", "autounified.com — all-in")}
              </p>
              <AuGear size={18} teeth={10} direction="fast" className="text-lime" />
            </div>

            <div className="p-6 md:p-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
                Price · USD
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-bold text-ink">$</span>
                <AuCountUp
                  to={priceNumber}
                  duration={1600}
                  className="nums font-sans font-bold leading-none tracking-[-0.05em] text-ink"
                  style={{ fontSize: "clamp(4.5rem, 11vw, 8.5rem)" }}
                />
              </div>

              <ul className="mt-6 space-y-2 font-mono text-[12px] text-ink">
                {features.map((li) => (
                  <li key={li} className="flex items-center gap-2">
                    <span aria-hidden className="h-2 w-2 bg-red" />
                    {li}
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-3">
                <AuMagnetic strength={0.18}>
                  <a
                    href={buyHref}
                    className="shine group flex w-full items-center justify-between border-2 border-ink bg-ink px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-red"
                  >
                    <span className="relative z-10">
                      {t("price.cta_primary", "Buy autounified.com")}
                    </span>
                    <span aria-hidden className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </AuMagnetic>
                <AuMagnetic strength={0.14}>
                  <a
                    href={questionHref}
                    className="shine group flex w-full items-center justify-between border-2 border-ink bg-paper px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-lime"
                  >
                    <span className="relative z-10">
                      {t("price.cta_secondary", "Ask a question")}
                    </span>
                    <span aria-hidden className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </AuMagnetic>
              </div>
            </div>

            <div className="flex items-center justify-between border-t-2 border-ink px-6 py-3">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
                {t("price.footer_note", "Secure · Escrow · Same-day")}
              </p>
              <span className="relative inline-flex h-2 w-2">
                <span aria-hidden className="absolute inline-flex h-full w-full bg-red pulse-ring" />
                <span className="relative inline-flex h-2 w-2 bg-red" />
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
