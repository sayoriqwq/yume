import type { FieldErrors, Resolver } from 'react-hook-form'
import { z } from 'zod'

export const friendLinkFormSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, '昵称不能为空')
    .max(20, '昵称不能超过 20 个字符'),
  siteName: z
    .string()
    .trim()
    .min(1, '网站名称不能为空')
    .max(40, '网站名称不能超过 40 个字符'),
  avatar: z
    .string()
    .trim()
    .url('请输入有效的头像链接'),
  link: z
    .string()
    .trim()
    .url('请输入有效的网站链接'),
  description: z
    .string()
    .trim()
    .max(100, '描述不能超过 100 个字符')
    .optional()
    .or(z.literal('')),
})

export type FriendLinkFormValues = z.infer<typeof friendLinkFormSchema>

export type FriendLinkPayload = Omit<FriendLinkFormValues, 'description'> & {
  description?: string
}

export function normalizeFriendLink(values: FriendLinkFormValues): FriendLinkPayload {
  const description = values.description?.trim()

  return {
    nickname: values.nickname.trim(),
    siteName: values.siteName.trim(),
    avatar: values.avatar.trim(),
    link: values.link.trim(),
    ...(description ? { description } : {}),
  }
}

export const friendLinkFormResolver: Resolver<FriendLinkFormValues> = async (values) => {
  const parsed = friendLinkFormSchema.safeParse(values)

  if (parsed.success) {
    return {
      values: parsed.data,
      errors: {},
    }
  }

  const errors = parsed.error.issues.reduce<FieldErrors<FriendLinkFormValues>>((acc, issue) => {
    const field = issue.path[0]

    if (typeof field === 'string' && !acc[field as keyof FriendLinkFormValues]) {
      acc[field as keyof FriendLinkFormValues] = {
        type: issue.code,
        message: issue.message,
      }
    }

    return acc
  }, {} as FieldErrors<FriendLinkFormValues>)

  return {
    values: {},
    errors,
  }
}
