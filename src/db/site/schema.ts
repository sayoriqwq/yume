import { z } from 'zod'

export const createFriendLinkSchema = z.object({
  nickname: z.string().min(1, '昵称不能为空'),
  siteName: z.string().min(1, '网站名称不能为空'),
  avatar: z.string().url('请输入有效的URL'),
  link: z.string().url('请输入有效的URL'),
  description: z.string().min(1, '网站描述不能为空'),
})
