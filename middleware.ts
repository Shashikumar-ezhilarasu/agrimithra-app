import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/', 
  '/auth(.*)', 
  '/api/posts(.*)', 
  '/community(.*)', 
  '/marketplace(.*)',
  '/api/gemini(.*)',
  '/api/chat-history(.*)'
])

export default clerkMiddleware((auth, req) => {
  // If it's a public route, don't enforce authentication
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Check if keys are missing - if so, don't protect to avoid 500
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return NextResponse.next()
  }

  // Force protection for other routes
  auth().protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
