import prisma from '@/db/prisma'
import { ApprovalStatus, ArticleType } from '@/generated'
import { createYumeErrorResponse } from '@/lib/YumeError'
import { NextResponse } from 'next/server'

export interface DashboardStatsResponse {
  data: {
    // 基础统计数据
    articlesCount: number
    commentsCount: number
    visitsCount: number
    subscribersCount: number

    // 文章详细统计
    articleTypeDistribution: {
      [ArticleType.BLOG]: number
      [ArticleType.NOTE]: number
      [ArticleType.DRAFT]: number
    }

    // 评论详细统计
    commentStatusDistribution: {
      [ApprovalStatus.PENDING]: number
      [ApprovalStatus.APPROVED]: number
      [ApprovalStatus.REJECTED]: number
    }

    // 内容统计
    categoryCount: number
    tagCount: number

    // 互动统计
    likeCount: number

    // 友链统计
    friendLinksCount: number
    friendLinksPendingCount: number

    // 最近活动
    recentCommentsCount: number
  }
}

export async function GET() {
  try {
    // 基础数据并行获取
    const [
      articlesCount,
      commentsCount,
      subscribersCount,
      categoryCount,
      tagCount,
      likeCount,
      friendLinksCount,
    ] = await Promise.all([
      // 文章总数
      prisma.article.count(),

      // 评论总数
      prisma.comment.count(),

      // 订阅用户数
      prisma.subscriber.count(),

      // 分类数
      prisma.category.count(),

      // 标签数
      prisma.tag.count(),

      // 点赞数
      prisma.like.count(),

      // 友链总数
      prisma.friendLink.count(),
    ])

    // 获取文章类型分布
    const blogCount = await prisma.article.count({ where: { type: ArticleType.BLOG } })
    const noteCount = await prisma.article.count({ where: { type: ArticleType.NOTE } })
    const draftCount = await prisma.article.count({ where: { type: ArticleType.DRAFT } })

    // 获取评论状态分布
    const pendingCommentsCount = await prisma.comment.count({ where: { status: ApprovalStatus.PENDING } })
    const approvedCommentsCount = await prisma.comment.count({ where: { status: ApprovalStatus.APPROVED } })
    const rejectedCommentsCount = await prisma.comment.count({ where: { status: ApprovalStatus.REJECTED } })

    // 获取待审核友链数量
    const friendLinksPendingCount = await prisma.friendLink.count({
      where: { status: ApprovalStatus.PENDING },
    })

    // 获取最近7天的评论数
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const recentCommentsCount = await prisma.comment.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    })

    // 获取访问量 (从SiteConfig表查询)
    let visitsCount = 0
    const visitsConfig = await prisma.siteConfig.findUnique({
      where: { key: 'total_visits' },
    })

    if (visitsConfig) {
      visitsCount = Number.parseInt(visitsConfig.value, 10) || 0
    }

    return NextResponse.json<DashboardStatsResponse>({
      data: {
        articlesCount,
        commentsCount,
        visitsCount,
        subscribersCount,

        articleTypeDistribution: {
          [ArticleType.BLOG]: blogCount,
          [ArticleType.NOTE]: noteCount,
          [ArticleType.DRAFT]: draftCount,
        },

        commentStatusDistribution: {
          [ApprovalStatus.PENDING]: pendingCommentsCount,
          [ApprovalStatus.APPROVED]: approvedCommentsCount,
          [ApprovalStatus.REJECTED]: rejectedCommentsCount,
        },

        categoryCount,
        tagCount,
        likeCount,

        friendLinksCount,
        friendLinksPendingCount,

        recentCommentsCount,
      },
    })
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}
