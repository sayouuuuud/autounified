import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getContent } from "@/lib/content"
import { AdminDashboard } from "./admin-dashboard"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Admin — autounified.com",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")
  const content = await getContent()
  return <AdminDashboard initialContent={content} email={session.email} />
}
