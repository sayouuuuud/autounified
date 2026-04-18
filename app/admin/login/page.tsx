import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { AdminLoginForm } from "./admin-login-form"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Admin Login — autounified.com",
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session) redirect("/admin")

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper text-ink">
      <div aria-hidden className="absolute inset-0 grid-paper opacity-50" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-stretch justify-center px-4 py-12">
        <div className="border-2 border-ink bg-paper shadow-[8px_8px_0_0_var(--ink)]">
          <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-5 py-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
              /admin · console
            </p>
            <span className="relative inline-flex h-2 w-2">
              <span aria-hidden className="absolute inline-flex h-full w-full bg-red pulse-ring" />
              <span className="relative inline-flex h-2 w-2 bg-red" />
            </span>
          </div>
          <div className="px-6 py-8 md:px-8 md:py-10">
            <h1 className="font-sans text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-ink md:text-5xl">
              Sign in.
            </h1>
            <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink/70">
              autounified.com · operator access
            </p>

            <AdminLoginForm />
          </div>
          <div className="flex items-center justify-between border-t-2 border-ink px-5 py-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
              Secure · httpOnly session
            </p>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
              LOT / 001
            </p>
          </div>
        </div>

        <a
          href="/"
          className="mt-6 self-center font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink/70 underline decoration-2 underline-offset-4 hover:text-red"
        >
          ← back to site
        </a>
      </div>
    </main>
  )
}
