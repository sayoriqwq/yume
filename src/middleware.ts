import type { UserRoleType } from '@/types/user'
import { UserRole } from '@/types/user'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/admin(.*)'])

export default clerkMiddleware(
  async (auth, req) => {
    const { userId, redirectToSignIn, sessionClaims } = await auth()
    if (!userId && isProtectedRoute(req)) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }

    // 鉴权
    const userRole = sessionClaims?.role as UserRoleType
    const isAdmin = userRole === UserRole.ADMIN

    if (isProtectedRoute(req) && !isAdmin) {
      return NextResponse.json({
        code: 403,
        message: '权限不足',
      }, { status: 403 })
    }

    return NextResponse.next()
  },
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // webhooks
    '/api/webhooks(.*)',
  ],
}
