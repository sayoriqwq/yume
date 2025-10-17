'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/db/prisma'
import { validateEmailAddress } from '@/lib/validate'

const FormSchema = z.object({
  email: z.string().email({
    message: '邮箱格式不正确',
  }).refine(validateEmailAddress, {
    message: '邮箱不合法',
  }),
})

export interface SubscribeState {
  success: boolean
  message: string
}

export async function createSubscriber(_currentState: SubscribeState, formData: FormData) {
  const validatedField = await FormSchema.safeParseAsync({
    email: formData.get('email'),
  })

  if (!validatedField.success) {
    return {
      success: false,
      message: '邮箱不合法',
    }
  }

  const email = validatedField.data.email

  try {
    await prisma.subscriber.create({
      data: { email },
    })
    revalidatePath('/')
    return {
      success: true,
      message: '感谢你的订阅',
    }
  }
  catch (error) {
    // 使用属性检查而不是instanceof，更可靠地检测Prisma错误
    // 在Next.js中，特别是服务器组件/Server Actions中，错误实例的类型检查会出现问题。这是因为错误在跨模块边界或序列化过程中可能会丢失其原始类型信息。
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return {
        success: false,
        message: '已经订阅过了',
      }
    }

    return { success: false, message: `订阅失败了! 原因:${error}` }
  }
}
