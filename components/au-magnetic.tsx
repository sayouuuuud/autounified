"use client"

import { useRef, type ReactElement, type MouseEvent, cloneElement } from "react"

/**
 * Wraps a single child element and applies a subtle magnetic translate on
 * pointer move. Works with any element that accepts a className + style +
 * event handlers (e.g. <a>, <button>).
 */
export function AuMagnetic({
  children,
  strength = 0.25,
}: {
  children: ReactElement<{
    className?: string
    style?: React.CSSProperties
    onMouseMove?: (e: MouseEvent<HTMLElement>) => void
    onMouseLeave?: (e: MouseEvent<HTMLElement>) => void
  }>
  strength?: number
}) {
  const ref = useRef<HTMLElement | null>(null)

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    ref.current = el
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  const handleLeave = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "translate3d(0,0,0)"
  }

  const cls = ["magnetic", children.props.className].filter(Boolean).join(" ")

  return cloneElement(children, {
    className: cls,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
  })
}
