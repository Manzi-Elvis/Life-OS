import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LifeOS - The Operating System for Your Mind",
  description:
    "A mental operating system to organize thoughts, track emotions, and optimize your mental performance. Built by MANZI RURANGIRWA Elvis.",
  generator: "LifeOS",
  authors: [{ name: "MANZI RURANGIRWA Elvis" }],
  keywords: ["mental health", "productivity", "thought mapping", "emotion tracking", "mindfulness"],
  manifest: "/manifest.json",
  openGraph: {
    title: "LifeOS - The Operating System for Your Mind",
    description: "Organize your thoughts, track emotions, and optimize mental performance",
    type: "website",
  },
  
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LifeOS",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
