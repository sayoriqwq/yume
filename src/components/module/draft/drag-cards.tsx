'use client'

import type { ArticlesResponse } from '@/app/api/articles/route'
import type { Draft } from '@/types/article/article'
import { Button } from '@/components/ui/button'
import { formatArticle } from '@/types/article/format'
import { motion } from 'framer-motion'
import { Info, LayoutGrid, Move } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import { DraftCard } from './draft-card'
import { DraftDragCard } from './drag-card'

type ViewMode = 'grid' | 'drag'

export function DraftDragCards() {
  const searchParams = useSearchParams()

  // 从URL中获取模式，如果没有则使用默认值'drag'
  const initialMode = (searchParams.get('mode') as ViewMode) || 'drag'
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const { data, isLoading, error } = useSWR<ArticlesResponse>(
    '/api/articles?type=DRAFT',
  )
  // 当模式改变时更新URL
  const updateMode = (mode: ViewMode) => {
    setViewMode(mode)

    // 构建新的URL参数
    const params = new URLSearchParams(searchParams.toString())
    params.set('mode', mode)

    // 更新URL而不刷新页面
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({ path: url }, '', url)
  }

  // 从localStorage获取保存的位置信息
  const getSavedPositions = () => {
    if (typeof window === 'undefined')
      return {}
    const saved = localStorage.getItem('draftCardPositions')
    return saved ? JSON.parse(saved) : {}
  }

  // 保存位置信息到localStorage
  const savePositions = (positions: Record<number, { top: string, left: string, rotate: string }>) => {
    if (typeof window === 'undefined')
      return
    localStorage.setItem('draftCardPositions', JSON.stringify(positions))
  }

  const generateCardPosition = (index: number, totalCards: number, articleId: number) => {
    const savedPositions = getSavedPositions()

    // 如果存在保存的位置，使用保存的位置
    if (savedPositions[articleId]) {
      return savedPositions[articleId]
    }

    // 否则生成新的位置
    const gridSize = Math.ceil(Math.sqrt(totalCards))
    const cellWidth = 100 / gridSize
    const cellHeight = 100 / gridSize

    const row = Math.floor(index / gridSize)
    const col = index % gridSize

    const randomOffset = () => (Math.random() - 0.5) * 20

    const position = {
      top: `${Math.min(Math.max(col * cellWidth + randomOffset(), 10), 90)}%`,
      left: `${Math.min(Math.max(row * cellHeight + randomOffset(), 10), 90)}%`,
      rotate: `${(Math.random() - 0.5) * 10}deg`,
    }

    // 保存新生成的位置
    savePositions({
      ...savedPositions,
      [articleId]: position,
    })

    return position
  }

  const drafts = data?.articles.map(article => formatArticle<Draft>(article)) || []

  if (isLoading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <div className="text-lg text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <div className="text-lg text-destructive-foreground">加载失败，请稍后再试</div>
      </div>
    )
  }

  if (drafts.length === 0) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center flex-col gap-4">
        <Info className="h-12 w-12 text-muted-foreground opacity-50" />
        <div className="text-lg text-muted-foreground">暂无短文</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {data?.meta.totalCount}
          {' '}
          篇短文
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => updateMode('grid')}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === 'drag' ? 'default' : 'outline'}
            size="icon"
            onClick={() => updateMode('drag')}
          >
            <Move className="size-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid'
        ? (
            <motion.div
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {drafts.map(draft => (
                <motion.div
                  key={draft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DraftCard
                    {...draft}
                    mode="grid"
                  />
                </motion.div>
              ))}
            </motion.div>
          )
        : (
            <motion.section
              className="relative h-[700px] w-full rounded-xl bg-card/50 backdrop-blur-sm border shadow-sm overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0" ref={containerRef}>
                {drafts.map((draft, index) => {
                  const { top, left, rotate } = generateCardPosition(index, drafts.length, draft.id)
                  return (
                    <DraftDragCard
                      key={draft.id}
                      containerRef={containerRef}
                      {...draft}
                      top={top}
                      left={left}
                      rotate={rotate}
                    />
                  )
                })}
              </div>
            </motion.section>
          )}
    </div>
  )
}
