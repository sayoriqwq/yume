import type { UserRoleType } from '@/types/user'
import type { NextRequest } from 'next/server'
import { UserRole } from '@/types/user'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth()
    const userRole = sessionClaims?.role as UserRoleType
    const isAdmin = userRole === UserRole.ADMIN

    // 理论上不会触发，因为middleware已经处理了
    if (!userId) {
      console.log('未授权')
      return redirectToSignIn({ returnBackUrl: req.url })
    }

    if (!isAdmin) {
      return NextResponse.json({
        code: 403,
        message: '权限不足',
      }, { status: 403 })
    }

    return handler(req)
  }
}
