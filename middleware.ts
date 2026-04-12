import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define which routes are public
const isPublicRoute = createRouteMatcher(['/', '/auth(.*)', '/api/posts(.*)', '/community(.*)', '/marketplace(.*)'])

export default function middleware(req: any, event: any) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  // If keys are missing (common on new Vercel deploys), bypass middleware to prevent 500
  if (!publishableKey || !secretKey) {
    console.warn("Clerk keys missing. Bypassing auth middleware.");
    return NextResponse.next();
  }

  // Use the standard clerkMiddleware if keys exist
  return clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()

    // Redirect logged-in users away from the splash page to the dashboard
    if (userId && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Protect all other routes
    if (!userId && !isPublicRoute(req)) {
      // In production/Vercel, if we can't redirect to sign-in smoothly, just allow navigation to avoid 500
      try {
        return (await auth()).redirectToSignIn()
      } catch (e) {
        return NextResponse.next();
      }
    }

    return NextResponse.next()
  })(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
