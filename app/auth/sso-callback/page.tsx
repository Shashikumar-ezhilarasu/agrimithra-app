"use client"

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"

export const dynamic = "force-dynamic"

export default function SSOCallbackPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return null
  }
  return <AuthenticateWithRedirectCallback />
}
