'use server'

import type { MessageState } from './type'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const MessageSchema = z.object({
  message: z.string().min(1, '消息不能为空').max(500, '消息长度不能超过500字符'),
})

export async function createMessage(formData: FormData): Promise<MessageState> {

  if (!user) {
    return {
      success: false,
      message: '请先登录',
    }
  }

  const validationResult = MessageSchema.safeParse({
    message: formData.get('message'),
  })

  if (!validationResult.success) {
    return {
      success: false,
      message: validationResult.error.errors.map(err => err.message).join('\n'),
    }
  }

  try {
    await prisma.comment.create({
      data: {
        content: validationResult.data.message ?? '',
        authorId: user.id,
        articleId: MESSAGE_FAKE_ARTICLE_ID,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/message')
    return {
      success: true,
      message: '留言发送成功',
    }
  }
  catch (error) {
    console.error(`出错了！原因是${error}`)
    return {
      success: false,
      message: '留言发送失败',
    }
  }
}
export async function deleteMessage(messageId: number): Promise<MessageState> {
  const user = await currentUser()

  if (!user) {
    return {
      success: false,
      message: '请先登录',
    }
  }

  try {
    const message = await prisma.comment.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      return {
        success: false,
        message: '留言不存在',
      }
    }

    if (message.authorId !== user.id) {
      return {
        success: false,
        message: '您没有权限删除这条留言',
      }
    }

    await prisma.comment.delete({
      where: { id: messageId },
    })

    revalidatePath('/message')
    return {
      success: true,
      message: '留言已成功删除',
    }
  }
  catch (error) {
    console.error(`出错了！原因是${error}`)
    return {
      success: false,
      message: '删除留言时出错',
    }
  }
}

export async function getMessages() {
  try {
    const messages = await prisma.comment.findMany({
      where: {
        articleId: MESSAGE_FAKE_ARTICLE_ID,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
    })
    return messages
  }
  catch (error) {
    console.error(`出错了！原因是${error}`)
    return []
  }
}
