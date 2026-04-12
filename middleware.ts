import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

// Only initialize Clerk's middleware if the keys are actually present.
const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

let myClerkMiddleware: any;

if (hasClerkKeys) {
  myClerkMiddleware = clerkMiddleware((auth, req) => {
    if (!isPublicRoute(req)) {
      auth().protect()
    }
  });
}

export default function middleware(req: NextRequest, event: any) {
  // Defensive check: If keys are missing (like in Vercel before environment variables are set up),
  // totally bypass Clerk to prevent MIDDLEWARE_INVOCATION_FAILED.
  if (!hasClerkKeys) {
    console.warn("Bypassing Clerk Auth: Missing CLERK_SECRET_KEY or NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
    return NextResponse.next();
  }
  
  // Otherwise, run the real Clerk middleware
  return myClerkMiddleware(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
