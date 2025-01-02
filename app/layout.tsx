import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Noto_Sans_JP } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })
const notoSansJP = Noto_Sans_JP({ 
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
})

export const metadata: Metadata = {
  title: "Project Haku",
  description: "A Japanese learning chatbot",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} ${notoSansJP.variable} transition-colors duration-300`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}