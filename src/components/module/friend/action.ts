'use server'

import type { FriendLinkFormValues, FriendLinkPayload } from './schema'
import { friendLinkFormSchema, normalizeFriendLink } from './schema'

export async function submitFriendLinkAction(data: FriendLinkFormValues) {
  const parsed = friendLinkFormSchema.safeParse(data)

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? '提交申请失败，请检查填写内容'

    return {
      success: false,
      error: message,
    } as const
  }

  const payload: FriendLinkPayload = normalizeFriendLink(parsed.data)

  // TODO: Persist friend link application (e.g., database, queue, notification)
  console.warn('好友申请待处理', payload)

  return {
    success: true,
    data: payload,
  } as const
}
