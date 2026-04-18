"use client"

type GearProps = {
  size?: number | string
  teeth?: number
  color?: string
  direction?: "cw" | "ccw" | "fast" | "static"
  className?: string
  strokeWidth?: number
}

/**
 * Brutalist gear — no curves on the teeth, just square nubs.
 * Wrapped in a <span> that carries the CSS rotation so the transform
 * works reliably across every browser (Safari has issues animating
 * `transform` on an <svg> root element).
 */
export function AuGear({
  size = 40,
  teeth = 10,
  color = "currentColor",
  direction = "cw",
  className = "",
  strokeWidth = 3,
}: GearProps) {
  const spinClass =
    direction === "cw" ? "spin-cw" : direction === "ccw" ? "spin-ccw" : direction === "fast" ? "spin-fast" : ""

  const R = 42 // outer radius of tooth ring
  const r = 34 // gear body radius
  const hole = 10
  const toothW = 8
  const toothH = 8

  const nubs = Array.from({ length: teeth }).map((_, i) => {
    const angle = (i * 360) / teeth
    return (
      <rect
        key={i}
        x={50 - toothW / 2}
        y={50 - R}
        width={toothW}
        height={toothH}
        fill={color}
        transform={`rotate(${angle} 50 50)`}
      />
    )
  })

  return (
    <span
      aria-hidden="true"
      className={`${spinClass} ${className}`}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        lineHeight: 0,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ display: "block" }}
      >
        {nubs}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill={color}
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <circle cx="50" cy="50" r={hole} fill="var(--paper)" />
      </svg>
    </span>
  )
}
