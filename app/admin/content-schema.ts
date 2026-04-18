// Human-friendly labels + multiline flags for every editable key.
// Keys not listed here still show up (by prefix), they just use a humanized
// version of the key as the label.

export type FieldHint = {
  label: string
  multiline?: boolean
  help?: string
}

export const FIELD_HINTS: Record<string, FieldHint> = {
  // Commerce / global
  "site.domain": { label: "Domain shown on the page" },
  "site.price_usd": {
    label: "Price — number only (USD)",
    help: "Just digits, e.g. 1000. This drives the big price display.",
  },
  "site.price_label": {
    label: "Price label",
    help: "How the price is written in text, e.g. $1,000.",
  },
  "site.sales_email": {
    label: "Sales email",
    help: "Where buyers reach you.",
  },
  "site.buy_url": {
    label: "Primary Buy link (mailto / escrow URL)",
    multiline: true,
  },
  "site.question_url": {
    label: "“Ask a question” link",
    multiline: true,
  },

  // Meta / SEO
  "meta.title": { label: "Browser tab title" },
  "meta.description": { label: "Meta description", multiline: true },
  "meta.og_title": { label: "OpenGraph / social title" },
  "meta.og_description": { label: "OpenGraph / social description", multiline: true },

  // Nav
  "nav.lot_label": { label: "Lot badge (top-left)" },
  "nav.domain_label": { label: "Domain in nav" },
  "nav.available_label": { label: "Availability chip" },
  "nav.cta": { label: "Buy button text" },
  "nav.link_thesis": { label: "Nav link — Thesis" },
  "nav.link_manifesto": { label: "Nav link — Manifesto" },
  "nav.link_buyers": { label: "Nav link — Buyers" },
  "nav.link_specs": { label: "Nav link — Specs" },
  "nav.link_system": { label: "Nav link — System" },

  // Hero
  "hero.eyebrow": { label: "Eyebrow line" },
  "hero.live_label": { label: "Live chip text" },
  "hero.headline_part_1": { label: "Headline — word 1 (auto)" },
  "hero.headline_part_2": { label: "Headline — word 2 (unified)" },
  "hero.headline_part_3": { label: "Headline — tld (.com)" },
  "hero.sub": { label: "Hero subtitle", multiline: true },
  "hero.cta_primary": { label: "Primary CTA label" },
  "hero.cta_secondary": { label: "Secondary CTA label" },
  "hero.price_label": { label: "Price block label" },
  "hero.price_tag": { label: "Price block tag" },
  "hero.price_note": { label: "Price fine-print note", multiline: true },
  "hero.whois_status": { label: "Whois status line" },

  // Marquee
  "marquee.items": {
    label: "Marquee words (comma separated)",
    multiline: true,
    help: "Example: AUTOMATE,UNIFY,ORCHESTRATE …",
  },

  // Flow
  "flow.headline": { label: "Thesis headline", multiline: true },
  "flow.body": { label: "Thesis body", multiline: true },
  "flow.point_1": { label: "Thesis bullet 1" },
  "flow.point_2": { label: "Thesis bullet 2" },
  "flow.point_3": { label: "Thesis bullet 3" },

  // Thesis / Manifesto
  "thesis.auto_body": { label: "/auto block body", multiline: true },
  "thesis.unified_body": { label: "/unified block body", multiline: true },
  "thesis.point_1_title": { label: "Manifesto 01 — title" },
  "thesis.point_1_body": { label: "Manifesto 01 — body", multiline: true },
  "thesis.point_2_title": { label: "Manifesto 02 — title" },
  "thesis.point_2_body": { label: "Manifesto 02 — body", multiline: true },
  "thesis.point_3_title": { label: "Manifesto 03 — title" },
  "thesis.point_3_body": { label: "Manifesto 03 — body", multiline: true },

  // Audience
  "audience.headline": { label: "Buyers headline", multiline: true },

  // Price
  "price.headline": { label: "Acquisition headline", multiline: true },
  "price.body": { label: "Acquisition body", multiline: true },
  "price.step_1": { label: "Step 01", multiline: true },
  "price.step_2": { label: "Step 02", multiline: true },
  "price.step_3": { label: "Step 03", multiline: true },
  "price.cta_primary": { label: "Acquisition primary CTA" },
  "price.cta_secondary": { label: "Acquisition secondary CTA" },

  // System
  "system.eyebrow": { label: "System eyebrow" },
  "system.body": { label: "System body", multiline: true },

  // Footer
  "footer.manifesto": { label: "Footer manifesto line", multiline: true },
  "footer.contact_label": { label: "Footer — Contact label" },
  "footer.process_label": { label: "Footer — Process label" },
  "footer.process_1": { label: "Footer — Process line 1" },
  "footer.process_2": { label: "Footer — Process line 2" },
  "footer.process_3": { label: "Footer — Process line 3" },
  "footer.sections_label": { label: "Footer — Sections label" },
  "footer.link_acquire": { label: "Footer link — Acquire" },
  "footer.transmission_label": { label: "Footer — End transmission label" },
  "footer.copyright": { label: "Copyright line" },
  "footer.lot": { label: "Lot line" },
}

export function humanize(key: string) {
  const last = key.split(".").slice(-1)[0] || key
  return last
    .replace(/_/g, " ")
    .replace(/([a-z])([0-9])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// Display order for the groups.
export const GROUP_ORDER = [
  "site",
  "meta",
  "nav",
  "hero",
  "marquee",
  "flow",
  "thesis",
  "audience",
  "specs",
  "price",
  "system",
  "footer",
]

export const GROUP_LABELS: Record<string, string> = {
  site: "Sale & Commerce",
  meta: "SEO / Meta",
  nav: "Navigation",
  hero: "Hero section",
  marquee: "Marquee ticker",
  flow: "Thesis section",
  thesis: "Manifesto",
  audience: "Intended Buyers",
  specs: "Specifications",
  price: "Acquisition section",
  system: "Live System section",
  footer: "Footer",
}
