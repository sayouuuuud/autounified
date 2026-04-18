"use client"

import { useEffect, useRef } from "react"

/**
 * A 2px fixed rail at the top of the viewport that scales X based on
 * document scroll progress. Uses rAF throttling + a CSS custom property
 * so we never trigger layout on scroll.
 */
export function AuScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return

    let raf = 0
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      el.style.setProperty("--p", String(p))
      raf = 0
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-ink/15"
    >
      <div
        ref={barRef}
        className="scroll-progress h-full origin-left bg-red"
      />
    </div>
  )
}
