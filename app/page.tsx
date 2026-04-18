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
import { AuVisitTracker } from "@/components/au-visit-tracker"
import { ContentProvider } from "@/components/content-provider"
import { getContent } from "@/lib/content"
import { triggerKeepAlive } from "@/lib/keep-alive"

// Always render with the freshest content so edits show up immediately.
export const dynamic = "force-dynamic"

export default async function Page() {
  // Self-triggered heartbeat: every visit checks whether the DB needs a ping.
  // Fire-and-forget; never blocks the render.
  triggerKeepAlive()
  const content = await getContent()
  return (
    <ContentProvider content={content}>
      <main className="relative w-full min-h-screen overflow-x-hidden bg-background text-foreground">
        <AuVisitTracker />
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
    </ContentProvider>
  )
}
