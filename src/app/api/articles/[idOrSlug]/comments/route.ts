import type { NextRequest } from 'next/server'
import { createCommentSchema } from '@/db/article/schema'
import { addComment, getArticleById, getArticleBySlug, getArticleComments } from '@/db/article/service'
import prisma from '@/db/prisma'
import { errorLogger } from '@/lib/error-handler'
import { parsePostBody } from '@/lib/parser'
import { createYumeError, createYumeErrorResponse, YumeErrorType } from '@/lib/YumeError'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// 获取文章评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  try {
    const { idOrSlug } = params
    let articleId

    // 判断是ID还是slug
    if (/^\d+$/.test(idOrSlug)) {
      articleId = Number.parseInt(idOrSlug, 10)

      // 验证文章是否存在
      const article = await getArticleById(articleId)
      if (!article) {
        throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
      }
    }
    else {
      // 通过slug查询文章
      const article = await getArticleBySlug(idOrSlug)
      if (!article) {
        throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
      }
      articleId = article.id
    }

    // 获取文章评论
    const comments = await getArticleComments(articleId)

    return NextResponse.json(comments)
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}

// 添加文章评论
export async function POST(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  try {
    // 验证用户
    const { userId } = await auth()

    if (!userId) {
      throw createYumeError(new Error('请先登录'), YumeErrorType.UnauthorizedError)
    }

    const { idOrSlug } = params
    let articleId

    // 判断是ID还是slug
    if (/^\d+$/.test(idOrSlug)) {
      articleId = Number.parseInt(idOrSlug, 10)

      // 验证文章是否存在
      const article = await getArticleById(articleId)
      if (!article) {
        throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
      }
    }
    else {
      // 通过slug查询文章
      const article = await getArticleBySlug(idOrSlug)
      if (!article) {
        throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
      }
      articleId = article.id
    }

    // 验证请求体
    const { content, parentId } = await parsePostBody(request, createCommentSchema)

    // 如果提供了父评论ID，验证父评论是否存在
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId, articleId },
      })

      if (!parentComment) {
        throw createYumeError(new Error('父评论不存在'), YumeErrorType.NotFoundError)
      }
    }

    // 添加评论
    const comment = await addComment(userId, articleId, content, parentId)

    return NextResponse.json(
      { message: '评论已提交，等待审核', comment },
      { status: 201 },
    )
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}
