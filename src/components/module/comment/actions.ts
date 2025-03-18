'use server'

import type { CommentState, CommentWithAuthor, CreateCommentData } from './types'
import { db } from '@/db'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const CommentSchema = z.object({
  content: z.string().min(1, '评论不能为空').max(500, '评论长度不能超过500字符'),
  articleId: z.number(),
  parentId: z.number().nullable().optional(),
})

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
    await db.comment.create({
      data: {
        content: validationResult.data.content,
        authorId: user.id,
        articleId: validationResult.data.articleId,
        parentId: validationResult.data.parentId,
        status: 'APPROVED',
      },
    })

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

    // 获取评论及其所有回复
    const comment = await db.comment.findUnique({
      where: { id },
      include: {
        replies: true,
      },
    })

    if (!comment) {
      return { success: false, message: '评论不存在' }
    }

    if (comment.authorId !== user.id) {
      return { success: false, message: '没有权限删除此评论' }
    }

    // 递归删除所有回复
    async function deleteReplies(commentId: number) {
      const replies = await db.comment.findMany({
        where: { parentId: commentId },
      })

      for (const reply of replies) {
        await deleteReplies(reply.id)
        await db.comment.delete({
          where: { id: reply.id },
        })
      }
    }

    // 先删除所有回复
    await deleteReplies(id)

    // 最后删除主评论
    await db.comment.delete({
      where: { id },
    })

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
    const comments = await db.comment.findMany({
      where: {
        articleId,
        status: 'APPROVED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
        },
      },
    })
    return comments as CommentWithAuthor[]
  }
  catch (error) {
    console.error('获取评论失败:', error)
    return []
  }
}
