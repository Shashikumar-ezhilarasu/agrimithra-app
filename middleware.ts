import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY

  // If Clerk keys are missing, skip auth logic to avoid runtime failures on Edge.
  if (!hasClerk) {
    return NextResponse.next()
  }

  const { clerkMiddleware } = await import('@clerk/nextjs/server')

  const handler = clerkMiddleware(async (auth, request) => {
    const { userId } = await auth()
    // Allow Clerk OAuth callback to pass through
    if (request.nextUrl.pathname.startsWith('/auth/sso-callback')) {
      return NextResponse.next()
    }
    if (userId && request.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  })
  return handler(req, ev)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
