import { DraftDragCards } from '@/components/module/draft/drag-cards'
import { Suspense } from 'react'

export default function DraftsPage() {
  return (
    <main className="container mx-auto px-4 py-8 h-[calc(100vh-48px)] max-w-6xl">
      <div className="space-y-6 mt-28">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold tracking-tight font-aboreto">drafts</h1>
          <p className="text-muted-foreground mt-2">
            这里是一些未成文的博客，在这里沉淀一些想法
          </p>
        </header>

        <div className="bg-muted/40 rounded-lg p-4 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">提示：</span>
            {' '}
            在拖拽模式下，按住 Alt 键和鼠标左键可以旋转卡片。
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">加载中...</div>}>
        <DraftDragCards />
      </Suspense>
    </main>
  )
}
