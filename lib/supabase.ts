// Minimal server-side Supabase REST helper.
// We use the service role key on the server so we can bypass RLS for admin writes
// and for reads that happen inside route handlers / RSCs.
// The anon key is only used for public reads of site_content via RLS.

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ""

const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""

function assertConfigured() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error(
      "Supabase is not configured. Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    )
  }
}

export async function sbSelect<T = unknown>(
  table: string,
  query = "",
  init: RequestInit = {},
): Promise<T> {
  assertConfigured()
  const url = `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ""}`
  const res = await fetch(url, {
    ...init,
    method: "GET",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Accept: "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`sbSelect ${table} ${res.status}: ${body}`)
  }
  return (await res.json()) as T
}

export async function sbInsert<T = unknown>(
  table: string,
  row: Record<string, unknown> | Record<string, unknown>[],
  opts: { onConflict?: string; returning?: "representation" | "minimal" } = {},
): Promise<T | null> {
  assertConfigured()
  const params = new URLSearchParams()
  if (opts.onConflict) params.set("on_conflict", opts.onConflict)
  const url = `${SUPABASE_URL}/rest/v1/${table}${
    params.toString() ? `?${params.toString()}` : ""
  }`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer:
        (opts.onConflict ? "resolution=merge-duplicates," : "") +
        `return=${opts.returning ?? "minimal"}`,
    },
    body: JSON.stringify(row),
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`sbInsert ${table} ${res.status}: ${body}`)
  }
  if (opts.returning === "representation") {
    return (await res.json()) as T
  }
  return null
}

export async function sbDelete(
  table: string,
  query: string,
): Promise<void> {
  assertConfigured()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: "DELETE",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`sbDelete ${table} ${res.status}: ${body}`)
  }
}

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SERVICE_KEY)
}
