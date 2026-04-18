"use client"

import { useEffect, useRef } from "react"

export function AuVisitTracker() {
  const sent = useRef(false)
  useEffect(() => {
    if (sent.current) return
    sent.current = true
    // Skip tracking when we're inside the admin area.
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      return
    }
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: typeof window !== "undefined" ? window.location.pathname : "/",
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
      }),
      keepalive: true,
    }).catch(() => {})
  }, [])
  return null
}
