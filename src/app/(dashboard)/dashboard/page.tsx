import { LoadingIcon } from '@/components/common/loading/loading-icon'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

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
}: {
  title: string
  description: string
  value: string | number
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

// 统计数据组件，可以封装数据获取逻辑
function StatsCards() {
  // 这里可以使用Server Component来获取数据
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="文章总数"
        description="所有发布和草稿文章"
        value="0"
      />
      <StatCard
        title="评论总数"
        description="所有文章的评论"
        value="0"
      />
      <StatCard
        title="访问量"
        description="本月访问量"
        value="0"
      />
      <StatCard
        title="订阅用户"
        description="总订阅用户数"
        value="0"
      />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">仪表盘</h1>
      <div className="space-y-6">
        <Suspense fallback={(
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).fill(0).map((_, i) => (
              <StatLoadingSkeleton key={i} />
            ))}
          </div>
        )}
        >
          <StatsCards />
        </Suspense>
      </div>
    </div>
  )
}
