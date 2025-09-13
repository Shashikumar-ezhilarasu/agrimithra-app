import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

// Force dynamic rendering to avoid prerender-time crashes when env vars are missing
export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return (
    <html lang="en" className="antialiased">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <LanguageProvider>
            {publishableKey ? (
              <ClerkProvider
                publishableKey={publishableKey}
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              >
                {children}
              </ClerkProvider>
            ) : (
              // Render without Clerk to prevent build-time crashes if env is not set
              children
            )}
            <Analytics />
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  )
}
