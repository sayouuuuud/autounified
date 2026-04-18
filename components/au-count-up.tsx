"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Count-up animation that triggers when the element enters the viewport.
 *
 * Uses requestAnimationFrame + easeOutQuart for a satisfying settle.
 * Starts from 0 and gradually increments to `to` over `duration` ms.
 * A small delay before the first frame ensures React has painted the
 * initial `0` state so the user actually sees the count rising.
 */
export function AuCountUp({
  to,
  duration = 1400,
  format = (n: number) => n.toLocaleString("en-US"),
  className,
  style,
}: {
  to: number
  duration?: number
  format?: (n: number) => string
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dur = reduce ? 700 : duration

    const run = () => {
      if (started.current) return
      started.current = true

      // One extra frame so the "0" is guaranteed to have been painted
      // before we start incrementing. Otherwise some browsers can fold
      // the 0 render and the first animated render into a single tick.
      requestAnimationFrame(() => {
        const t0 = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / dur)
          const eased = 1 - Math.pow(1 - t, 4)
          setValue(Math.round(to * eased))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run()
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)

    // Safety: if the element is already visible at mount (above the fold),
    // IntersectionObserver WILL fire async on the next tick — but if for any
    // reason the observer doesn't trigger within 400ms, kick it manually.
    const safety = window.setTimeout(() => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      if (r.top < vh && r.bottom > 0) run()
    }, 400)

    return () => {
      io.disconnect()
      clearTimeout(safety)
    }
  }, [to, duration])

  return (
    <span ref={ref} className={className} style={style}>
      {format(value)}
    </span>
  )
}
