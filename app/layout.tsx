import type { Metadata } from "next"
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuScrollProgress } from "@/components/au-scroll-progress"
import { getContent, pick } from "@/lib/content"
import "./globals.css"

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent()
  const title = pick(
    content,
    "meta.title",
    "autounified.com — Premium AI Domain / $1,000 USD",
  )
  const description = pick(
    content,
    "meta.description",
    "autounified.com — a one-word .com for the age of autonomous, unified AI. One lot. $1,000 USD.",
  )
  const ogTitle = pick(
    content,
    "meta.og_title",
    "autounified.com — Premium AI Domain",
  )
  const ogDescription = pick(
    content,
    "meta.og_description",
    "A one-word .com for the age of autonomous, unified AI. $1,000 USD.",
  )
  return {
    title,
    description,
    generator: "v0.app",
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
    },
    icons: {
<<<<<<< HEAD
      icon: "/icon.png",
      apple: "/apple-icon.png",
=======
      icon: "/icon.svg",
>>>>>>> f8305241a7995b3647bef24161530205e9bdae05
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${jetbrains.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AuScrollProgress />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
