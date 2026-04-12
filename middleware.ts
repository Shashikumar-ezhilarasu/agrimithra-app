import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
])

export default function middleware(req: NextRequest, event: any) {
  // 1. If keys are missing (ex: in Vercel before you configure Env Vars),
  // we exit early. This prevents the Clerk library from throwing
  // a 'Missing secret_key' error that causes a 500 MIDDLEWARE_INVOCATION_FAILED crash.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return NextResponse.next()
  }

  // 2. If keys exist, we instantiate the Clerk middleware dynamically IN THE REQUEST LOOP
  // rather than at the top of the file. This ensures Vercel's Edge runtime doesn't crash 
  // during initialization if the environment isn't fully ready.
  const clerkHandler = clerkMiddleware((auth, request) => {
    if (isProtectedRoute(request)) {
      auth().protect()
    }
  })

  // 3. Return the evaluated clerk middleware
  return clerkHandler(req, event)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
