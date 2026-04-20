import { clerkMiddleware, createRouteMatcher, redirectToSignIn } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
])

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request) && !auth().userId) {
    return redirectToSignIn({ returnBackUrl: request.url })
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
