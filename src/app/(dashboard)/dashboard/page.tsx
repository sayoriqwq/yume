'use client'

import { useStats } from '@/atoms/dashboard/hooks/useStats'
import { LoadingIcon } from '@/components/common/loading/loading-icon'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApprovalStatus, ArticleType } from '@/generated'
import { AlertTriangle, BarChart3, CheckCircle, Clock, FilePlus, MessageSquare, PenTool, Tag, ThumbsUp, Users } from 'lucide-react'

// 复用加载组件
function StatLoadingSkeleton() {
  return (
    <div className="flex-center h-24 w-full rounded-md bg-muted/30">
      <LoadingIcon />
    </div>
  )
}

// 状态卡片组件
function StatCard({
  title,
  description,
  value,
  icon: Icon,
  accentColor = 'bg-primary/10 text-primary',
}: {
  title: string
  description: string
  value: string | number
  icon: React.ElementType
  accentColor?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`rounded-full p-2 ${accentColor}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

// 主要统计数据组件
function MainStatsCards() {
  const { stats, isLoading, error } = useStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatLoadingSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p>加载统计数据时出错，请刷新页面重试</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="文章总数"
        description="所有发布和草稿文章"
        value={stats.articlesCount.toLocaleString()}
        icon={PenTool}
        accentColor="bg-blue-100 text-blue-700"
      />
      <StatCard
        title="评论总数"
        description="所有文章的评论"
        value={stats.commentsCount.toLocaleString()}
        icon={MessageSquare}
        accentColor="bg-indigo-100 text-indigo-700"
      />
      <StatCard
        title="访问量"
        description="总访问量"
        value={stats.visitsCount.toLocaleString()}
        icon={BarChart3}
        accentColor="bg-green-100 text-green-700"
      />
      <StatCard
        title="订阅用户"
        description="总订阅用户数"
        value={stats.subscribersCount.toLocaleString()}
        icon={Users}
        accentColor="bg-purple-100 text-purple-700"
      />
    </div>
  )
}

// 内容统计组件
function ContentStatsCards() {
  const { stats, isLoading } = useStats()

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatLoadingSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <StatCard
        title="分类数量"
        description="文章分类"
        value={stats.categoryCount}
        icon={Tag}
        accentColor="bg-amber-100 text-amber-700"
      />
      <StatCard
        title="标签数量"
        description="文章标签"
        value={stats.tagCount}
        icon={Tag}
        accentColor="bg-emerald-100 text-emerald-700"
      />
      <StatCard
        title="点赞数"
        description="文章和评论获赞"
        value={stats.likeCount}
        icon={ThumbsUp}
        accentColor="bg-rose-100 text-rose-700"
      />
    </div>
  )
}

// 提醒卡片展示待处理项目
function AlertCards() {
  const { stats, isLoading } = useStats()

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatLoadingSkeleton key={i} />
        ))}
      </div>
    )
  }

  const pendingCommentsCount = stats.commentStatusDistribution[ApprovalStatus.PENDING]
  const pendingFriendLinksCount = stats.friendLinksPendingCount
  const recentCommentsCount = stats.recentCommentsCount

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <StatCard
        title="待审核评论"
        description="需要审核的评论"
        value={pendingCommentsCount}
        icon={AlertTriangle}
        accentColor={pendingCommentsCount > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}
      />
      <StatCard
        title="待审核友链"
        description="需要审核的友链"
        value={pendingFriendLinksCount}
        icon={AlertTriangle}
        accentColor={pendingFriendLinksCount > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}
      />
      <StatCard
        title="最近评论"
        description="过去7天评论"
        value={recentCommentsCount}
        icon={Clock}
        accentColor="bg-cyan-100 text-cyan-700"
      />
    </div>
  )
}

// 文章类型分布统计
function ArticleTypeStats() {
  const { stats, isLoading } = useStats()

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatLoadingSkeleton key={i} />
        ))}
      </div>
    )
  }

  const { articleTypeDistribution } = stats
  const blogCount = articleTypeDistribution[ArticleType.BLOG]
  const noteCount = articleTypeDistribution[ArticleType.NOTE]
  const draftCount = articleTypeDistribution[ArticleType.DRAFT]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      <StatCard
        title="博客文章"
        description="已发布的博客"
        value={blogCount}
        icon={CheckCircle}
        accentColor="bg-green-100 text-green-700"
      />
      <StatCard
        title="随记"
        description="短篇随记"
        value={noteCount}
        icon={MessageSquare}
        accentColor="bg-blue-100 text-blue-700"
      />
      <StatCard
        title="草稿"
        description="未发布的草稿"
        value={draftCount}
        icon={FilePlus}
        accentColor="bg-gray-100 text-gray-700"
      />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">仪表盘</h1>
      <div className="space-y-8">
        {/* 主要统计数据 */}
        <MainStatsCards />

        {/* 分类展示其他统计 */}
        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="alerts">待处理事项</TabsTrigger>
            <TabsTrigger value="content">内容统计</TabsTrigger>
            <TabsTrigger value="articles">文章分布</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="mt-0">
            <AlertCards />
          </TabsContent>

          <TabsContent value="content" className="mt-0">
            <ContentStatsCards />
          </TabsContent>

          <TabsContent value="articles" className="mt-0">
            <ArticleTypeStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
