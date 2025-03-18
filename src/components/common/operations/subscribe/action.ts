'use server'

import { db } from '@/db'
import { validateEmailAddress } from '@/lib/validate'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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
    await db.subscriber.create({
      data: { email },
    })
    revalidatePath('/')
    return {
      success: true,
      message: '感谢你的订阅',
    }
  }
  catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      return {
        success: false,
        message: '已经订阅过了',
      }
    }

    console.error(error)
    return { success: false, message: `订阅失败了! 原因:${error}` }
  }
}
