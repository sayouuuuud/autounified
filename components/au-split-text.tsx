"use client"

import { useEffect, useRef } from "react"

/**
 * Splits a word into individual letters and reveals them one-by-one
 * when the element enters the viewport. Uses a class-based reveal so it
 * keeps working with the global AuRevealObserver. Each letter gets its
 * own stagger via inline --reveal-delay.
 */
export function AuSplitText({
  text,
  as: Tag = "span",
  baseDelay = 0,
  stepMs = 40,
  variant = "reveal-up",
  className,
  letterClassName,
}: {
  text: string
  as?: keyof JSX.IntrinsicElements
  baseDelay?: number
  stepMs?: number
  variant?: "reveal-up" | "reveal-down" | "reveal-scale"
  className?: string
  letterClassName?: string
}) {
  const ref = useRef<HTMLElement>(null)

  // observe locally (independent of the global one) so we can re-trigger
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const letters = Array.from(root.querySelectorAll<HTMLElement>(".reveal"))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            letters.forEach((l) => l.classList.add("in-view"))
          } else if (e.boundingClientRect.top > 0) {
            // reset only when we scroll back up past it (so it re-plays)
            letters.forEach((l) => l.classList.remove("in-view"))
          }
        })
      },
      { threshold: 0.25 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [text])

  const chars = Array.from(text)

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {chars.map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={["inline-block reveal", variant, letterClassName].filter(Boolean).join(" ")}
          style={{
            ["--reveal-delay" as string]: `${baseDelay + i * stepMs}ms`,
            whiteSpace: c === " " ? "pre" : undefined,
          }}
        >
          {c}
        </span>
      ))}
    </Tag>
  )
}
