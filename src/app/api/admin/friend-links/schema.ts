import { ApprovalStatus } from '@/generated'
import { z } from 'zod'

export const updateFriendLinkSchema = z.object({
  nickname: z.string().min(1, '昵称不能为空').optional(),
  siteName: z.string().min(1, '网站名称不能为空').optional(),
  link: z.string().url('网站链接必须是有效的URL').optional(),
  description: z.string().min(1, '描述不能为空').optional(),
  avatar: z.string().url('头像链接必须是有效的URL').optional(),
  status: z.nativeEnum(ApprovalStatus).optional(),
})

export const friendLinkListSchema = z.object({
  status: z.nativeEnum(ApprovalStatus).optional(),
})
