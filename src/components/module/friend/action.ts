'use server'

import type { z } from 'zod'
import { createFriendLinkSchema } from '@/db/site/schema'
import { createFriendLink } from '@/db/site/service'
import { errorLogger } from '@/lib/error-handler'

export async function submitFriendLinkAction(data: z.infer<typeof createFriendLinkSchema>) {
  try {
    const validatedData = createFriendLinkSchema.parse(data)

    const result = await createFriendLink(validatedData)

    return {
      success: true,
      data: result,
    }
  }
  catch (error) {
    errorLogger(error)
    return {
      success: false,
      error: '提交申请失败，请稍后再试',
    }
  }
}
