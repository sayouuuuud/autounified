import type { Metadata } from "next"
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuScrollProgress } from "@/components/au-scroll-progress"
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

export const metadata: Metadata = {
  title: "autounified.com — Premium AI Domain / $1,000 USD",
  description:
    "autounified.com — a one-word .com for the age of autonomous, unified AI. One lot. $1,000 USD.",
  generator: "v0.app",
  openGraph: {
    title: "autounified.com — Premium AI Domain",
    description:
      "A one-word .com for the age of autonomous, unified AI. $1,000 USD.",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
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
