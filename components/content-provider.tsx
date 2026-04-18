"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { ContentMap } from "@/lib/content"

const Ctx = createContext<ContentMap>({})

export function ContentProvider({
  content,
  children,
}: {
  content: ContentMap
  children: ReactNode
}) {
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>
}

// Hook used by every public component. Always falls back to the literal
// default so the site renders even if the DB is empty.
export function useCopy() {
  const map = useContext(Ctx)
  return (key: string, fallback: string) => {
    const v = map[key]
    return typeof v === "string" && v.length > 0 ? v : fallback
  }
}
