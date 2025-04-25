'use server'

import type { CommentState, CommentWithAuthor, CreateCommentData } from './types'
import { CommentSchema } from '@/db/comment/schema'
import { addComment, deleteComment as deleteCommentService, getArticleComments } from '@/db/comment/service'
import prisma from '@/db/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function createComment(data: CreateCommentData): Promise<CommentState> {
  const user = await currentUser()

  if (!user) {
    return {
      success: false,
      message: '请先登录',
    }
  }

  const validationResult = CommentSchema.safeParse(data)

  if (!validationResult.success) {
    return {
      success: false,
      message: validationResult.error.errors.map(err => err.message).join('\n'),
    }
  }

  try {
    // 只会在开发的时候有可能会出现，测试的时候没有开webhook针对本地地址的代理因此没有同步user数据到数据库

    // 检查用户是否存在于数据库中
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    // 如果用户不存在，则创建用户
    if (!dbUser) {
      const primaryEmail = user.emailAddresses?.find(
        email => email.id === user.primaryEmailAddressId,
      )?.emailAddress

      await prisma.user.create({
        data: {
          id: user.id,
          username: user.username || user.firstName || '神秘',
          email: primaryEmail || null,
          image_url: user.imageUrl,
          clerkData: JSON.parse(JSON.stringify(user)),
        },
      })
    }

    await addComment(
      user.id,
      validationResult.data.articleId,
      validationResult.data.content,
      validationResult.data.parentId || undefined,
    )

    revalidatePath(`/posts/[category]/[slug]`)
    return {
      success: true,
      message: '评论发送成功',
    }
  }
  catch (error) {
    console.error(`出错了！原因是${error}`)
    return {
      success: false,
      message: '评论发送失败',
    }
  }
}

export async function deleteComment({ id }: { id: number }) {
  try {
    const user = await currentUser()
    if (!user) {
      return { success: false, message: '请先登录' }
    }

    await deleteCommentService(id, user.id)

    revalidatePath('/posts/[category]/[slug]')
    return { success: true, message: '评论已删除' }
  }
  catch (error) {
    console.error('删除评论失败:', error)
    return { success: false, message: '删除评论失败' }
  }
}

export async function getComments(articleId: number): Promise<CommentWithAuthor[]> {
  try {
    // 使用 service 中的 getArticleComments 函数
    const comments = await getArticleComments(articleId)
    // 确保返回类型匹配 CommentWithAuthor
    return comments.map(comment => ({
      ...comment,
      replies: (comment.replies || []).map(reply => ({
        ...reply,
        replies: [],
      })),
    })) as CommentWithAuthor[]
  }
  catch (error) {
    console.error('获取评论失败:', error)
    return []
  }
}
