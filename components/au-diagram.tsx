"use client"

/**
 * Automation Unification Diagram
 *
 * Six scattered source nodes on the left, flowing via animated dashed
 * circuits into one unified CORE on the right. Single label, no overlap.
 */
export function AuDiagram({
  compact = false,
}: {
  variant?: "light" | "dark"
  compact?: boolean
}) {
  void compact
  const ink = "var(--ink)"
  const paper = "var(--paper)"
  const red = "var(--red)"
  const lime = "var(--lime)"

  const nodes = [
    { y: 40, label: "AGENT" },
    { y: 90, label: "MODEL" },
    { y: 140, label: "TOOL" },
    { y: 190, label: "DATA" },
    { y: 240, label: "API" },
    { y: 290, label: "PIPE" },
  ]

  const nodeX = 40
  const nodeW = 80
  const nodeH = 30

  // core positioning
  const coreW = 170
  const coreH = 120
  const coreX = 450
  const coreY = 165 - coreH / 2 // top = 105, bottom = 225

  // total canvas — widened so the exit arrow + label live outside the core
  const vbW = 820
  const vbH = 360

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className="h-auto w-full"
      role="img"
      aria-label="Automation unification diagram"
    >
      <rect width="100%" height="100%" fill={paper} />

      {/* subtle grid */}
      <g stroke={ink} strokeOpacity="0.06" strokeWidth="1">
        {Array.from({ length: 17 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 52} y1={0} x2={i * 52} y2={vbH} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 44} x2={vbW} y2={i * 44} />
        ))}
      </g>

      {/* section annotations — top */}
      <text x="40" y="20" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill={ink} letterSpacing="1.5">
        [ INPUTS ]
      </text>
      <text x="240" y="20" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill={ink} letterSpacing="1.5">
        [ ORCHESTRATION ]
      </text>
      <text x="450" y="20" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill={ink} letterSpacing="1.5">
        [ UNIFIED CORE ]
      </text>
      <text
        x={vbW - 20}
        y="20"
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize="10"
        fontWeight="700"
        fill={ink}
        letterSpacing="1.5"
      >
        [ OUTPUT ]
      </text>

      {/* connection lines — flowing dashed traces */}
      <g fill="none" stroke={ink} strokeWidth="2">
        {nodes.map((n, i) => {
          const sx = nodeX + nodeW
          const sy = n.y + nodeH / 2
          const mx = 240
          const ex = coreX
          const ey = 165
          const d = `M ${sx} ${sy} L ${mx} ${sy} L ${mx} ${ey} L ${ex} ${ey}`
          return (
            <path
              key={i}
              d={d}
              className="dash-flow"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          )
        })}
      </g>

      {/* source nodes */}
      {nodes.map((n, i) => (
        <g key={n.label}>
          <rect
            x={nodeX}
            y={n.y}
            width={nodeW}
            height={nodeH}
            fill={paper}
            stroke={ink}
            strokeWidth="2"
          />
          <text
            x={nodeX + nodeW / 2}
            y={n.y + nodeH / 2 + 4}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fontWeight="700"
            fill={ink}
            letterSpacing="1"
          >
            {n.label}
          </text>
          <circle cx={nodeX + nodeW} cy={n.y + nodeH / 2} r="3" fill={red} />
          <circle
            cx={nodeX + nodeW}
            cy={n.y + nodeH / 2}
            r="3"
            fill={red}
            className="pulse-ring"
            style={{
              animationDelay: `${i * 0.3}s`,
              transformOrigin: `${nodeX + nodeW}px ${n.y + nodeH / 2}px`,
            }}
          />
        </g>
      ))}

      {/* vertical spine */}
      <line
        x1="240"
        y1="30"
        x2="240"
        y2="330"
        stroke={ink}
        strokeWidth="2"
        strokeDasharray="2 4"
        opacity="0.35"
      />

      {/* ---------- core node ---------- */}
      <g>
        {/* drop shadow */}
        <rect
          x={coreX + 6}
          y={coreY + 6}
          width={coreW}
          height={coreH}
          fill={ink}
          opacity="0.25"
        />
        {/* body */}
        <rect
          x={coreX}
          y={coreY}
          width={coreW}
          height={coreH}
          fill={lime}
          stroke={ink}
          strokeWidth="3"
        />
        {/* tag */}
        <text
          x={coreX + 12}
          y={coreY + 20}
          fontFamily="var(--font-mono)"
          fontSize="10"
          fontWeight="700"
          fill={ink}
          letterSpacing="1.5"
        >
          /CORE · 001
        </text>
        {/* single confident label */}
        <text
          x={coreX + coreW / 2}
          y={coreY + 65}
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="22"
          fontWeight="700"
          fill={ink}
          letterSpacing="-1"
        >
          AUTOUNIFIED
        </text>
        {/* separator */}
        <line
          x1={coreX + 18}
          y1={coreY + 82}
          x2={coreX + coreW - 18}
          y2={coreY + 82}
          stroke={ink}
          strokeWidth="2"
        />
        {/* live indicator */}
        <text
          x={coreX + 12}
          y={coreY + coreH - 14}
          fontFamily="var(--font-mono)"
          fontSize="9"
          fontWeight="700"
          fill={ink}
          letterSpacing="1.5"
        >
          ONLINE
        </text>
        <circle cx={coreX + coreW - 18} cy={coreY + coreH - 18} r="3" fill={red}>
          <animate attributeName="r" values="3;5;3" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* output arrow — lives entirely OUTSIDE the core */}
      <g>
        {/* dashed flow line */}
        <line
          x1={coreX + coreW}
          y1={165}
          x2={vbW - 20}
          y2={165}
          stroke={ink}
          strokeWidth="2"
          className="dash-flow"
        />
        {/* arrow head */}
        <polygon
          points={`${vbW - 20},165 ${vbW - 30},161 ${vbW - 30},169`}
          fill={ink}
        />
        {/* label — centered above the arrow, far from the core */}
        <text
          x={(coreX + coreW + vbW - 20) / 2}
          y={152}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fontWeight="700"
          fill={ink}
          letterSpacing="1.5"
        >
          ONE SYSTEM
        </text>
        {/* sub-label — below the arrow */}
        <text
          x={(coreX + coreW + vbW - 20) / 2}
          y={182}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="9"
          fontWeight="700"
          fill={ink}
          opacity="0.55"
          letterSpacing="1.5"
        >
          one coordinated output
        </text>
      </g>

      {/* corner brackets */}
      <g stroke={ink} strokeWidth="2" fill="none">
        <path d="M 8 8 L 8 28 M 8 8 L 28 8" />
        <path d={`M ${vbW - 8} ${vbH - 8} L ${vbW - 8} ${vbH - 28} M ${vbW - 8} ${vbH - 8} L ${vbW - 28} ${vbH - 8}`} />
      </g>
    </svg>
  )
}
