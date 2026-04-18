import { AuNav } from "@/components/au-nav"
import { AuHero } from "@/components/au-hero"
import { AuMarquee } from "@/components/au-marquee"
import { AuFlow } from "@/components/au-flow"
import { AuThesis } from "@/components/au-thesis"
import { AuAudience } from "@/components/au-audience"
import { AuSpecs } from "@/components/au-specs"
import { AuPrice } from "@/components/au-price"
import { AuSystem } from "@/components/au-system"
import { AuFooter } from "@/components/au-footer"

export default function Page() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-background text-foreground">
      <AuNav />
      <AuHero />
      <AuMarquee />
      <AuFlow />
      <AuThesis />
      <AuAudience />
      <AuSpecs />
      <AuPrice />
      <AuSystem />
      <AuFooter />
    </main>
  )
}
