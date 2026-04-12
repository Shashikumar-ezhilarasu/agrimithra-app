import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "AgriMithra - Agricultural Assistant",
  description: "AI-powered agricultural assistant for farmers",
  generator: "v0.app",
}

// Force dynamic rendering to avoid prerender-time crashes
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
                signInFallbackRedirectUrl="/dashboard"
                signUpFallbackRedirectUrl="/dashboard"
              >
                <header className="flex justify-end items-center p-4 gap-4 h-16 border-b shadow-sm">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="bg-[#6c47ff] text-white rounded-md font-medium text-sm h-10 px-4 cursor-pointer hover:bg-[#5b3ce0] transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="border border-[#6c47ff] text-[#6c47ff] rounded-md font-medium text-sm h-10 px-4 cursor-pointer hover:bg-slate-50 transition-colors">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </header>
                <main>{children}</main>
              </ClerkProvider>
            ) : (
              <>
                <header className="flex justify-between items-center p-4 h-16 border-b bg-amber-50 text-amber-800">
                  <div className="font-semibold px-4 text-xl">AgriMithra</div>
                  <div className="text-sm px-4">
                    ⚠️ <strong>Clerk setup needed:</strong> Please add your <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code> to <code>.env.local</code>.
                  </div>
                </header>
                <main>{children}</main>
              </>
            )}
            <Analytics />
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  )
}
