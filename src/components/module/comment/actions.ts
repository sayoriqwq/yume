'use server'

import { addComment, deleteComment as deleteCommentService, getArticleComments } from '@/db/comment/service'
import prisma from '@/db/prisma'
import { errorLogger } from '@/lib/error-handler'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

/**
 * 创建评论的server action
 */
export async function createComment(content: string, articleId: number, parentId: number | null = null, path: string) {
  const { userId } = await auth()

  if (!userId) {
    throw createYumeError(new Error('请先登录'), YumeErrorType.UnauthorizedError)
  }

  if (!content.trim()) {
    throw createYumeError(new Error('评论内容不能为空'), YumeErrorType.ValidationError)
  }

  try {
    // 确保用户存在于数据库
    const dbUser = await prisma.user.findUnique({ where: { id: userId } })

    if (!dbUser) {
      const user = await currentUser()
      if (!user)
        throw createYumeError(new Error('用户信息获取失败'), YumeErrorType.UnauthorizedError)

      const primaryEmail = user.emailAddresses?.find(
        email => email.id === user.primaryEmailAddressId,
      )?.emailAddress

      await prisma.user.create({
        data: {
          id: user.id,
          username: user.username || user.firstName || '神秘用户',
          email: primaryEmail || null,
          image_url: user.imageUrl,
          clerkData: JSON.parse(JSON.stringify(user)),
        },
      })
    }

    // 创建评论
    const comment = await addComment(userId, articleId, content, parentId || undefined)

    // 获取完整的评论信息（包含作者）
    const fullComment = await prisma.comment.findUnique({
      where: { id: comment.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image_url: true,
          },
        },
      },
    })

    revalidatePath(path)

    if (!fullComment) {
      throw createYumeError(new Error('评论创建失败'), YumeErrorType.BadRequestError)
    }

    return {
      success: true,
      comment: fullComment,
    }
  }
  catch (error) {
    errorLogger(error)
    throw createYumeError(error)
  }
}

/**
 * 删除评论的server action
 */
export async function deleteComment(id: number, path: string) {
  const { userId } = await auth()

  if (!userId) {
    throw createYumeError(new Error('请先登录'), YumeErrorType.UnauthorizedError)
  }

  try {
    await deleteCommentService(id, userId)

    revalidatePath(path)

    return {
      success: true,
      id,
    }
  }
  catch (error) {
    console.error('删除评论失败:', error)
    throw createYumeError(error)
  }
}

/**
 * 获取文章评论的server action
 */
export async function getArticleCommentsAction(articleId: number) {
  try {
    const comments = await getArticleComments(articleId)
    return comments
  }
  catch (error) {
    console.error('获取评论失败:', error)
    throw createYumeError(error)
  }
}
