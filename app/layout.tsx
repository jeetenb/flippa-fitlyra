import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// <CHANGE> Updated fonts for FitLyra brand
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

// <CHANGE> Updated metadata for FitLyra
export const metadata: Metadata = {
  title: "FitLyra - Your AI-Powered Fitness Coach",
  description:
    "Transform your fitness journey with personalized AI-generated workout plans tailored to your goals, fitness level, and preferences.",
  keywords: ["AI fitness", "workout plans", "personal trainer", "fitness coach", "exercise"],
  icons: {
    icon: [
      {
        url: "icon/favicon.png",
        sizes: "512x512",
      },
      {
        url: "icon/favicon.png",
        sizes: "512x512",
      },
      {
        url: "icon/favicon.png",
        sizes: "512x512",
      },
    ],
    apple: "icon/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DDFF0BE71D"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-DDFF0BE71D');
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
