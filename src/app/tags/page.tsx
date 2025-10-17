'use client'

import { TagBadge } from '@/components/module/tag/tag-badge'
import { TagContent } from '@/components/module/tag/tag-content'
import { motion } from 'framer-motion'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'
import useSWR from 'swr'

export default function TagsPage() {
  const { data: tagsList = [], isLoading, error } = useSWR('/api/tags', async (url: string) => {
    const res = await fetch(url)
    if (!res.ok)
      throw new Error('获取标签失败')
    return res.json()
  })

  // 按count排序
  const sortedTagsList = [...tagsList].sort((a, b) => b.count - a.count)

  // 计算标签大小
  const calculateTagSize = (count: number) => {
    const maxCount = sortedTagsList.length > 0 ? sortedTagsList[0].count : 0
    const minCount = sortedTagsList.length > 0 ? sortedTagsList[sortedTagsList.length - 1].count : 0

    // 避免除以零
    if (maxCount === minCount)
      return 'md'

    const ratio = (count - minCount) / (maxCount - minCount)

    if (ratio > 0.8)
      return 'lg'
    if (ratio > 0.5)
      return 'md'
    if (ratio > 0.2)
      return 'sm'
    return 'sm'
  }

  // 使用模态框
  const { present } = useModalStack()

  // 当点击标签时显示文章列表
  const showTagArticles = useCallback((tagName: string) => {
    present({
      title: `标签: ${tagName}`,
      content: () => <TagContent name={tagName} />,
    })
  }, [present])

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">标签云</h1>
        <p className="text-red-500">
          加载标签出错：
          {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 min-h-screen">
      <motion.h1
        className="text-4xl font-bold mb-12 mt-24 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        标签云
      </motion.h1>

      {sortedTagsList.length === 0
        ? (
            <p className="text-center text-muted-foreground">暂无标签</p>
          )
        : (
            <motion.div
              className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto p-6 rounded-lg bg-card/50 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {sortedTagsList.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 + index * 0.03,
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <TagBadge
                    key={tag.id}
                    name={tag.name}
                    count={tag.count}
                    size={calculateTagSize(tag.count)}
                    onClick={() => showTagArticles(tag.name)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
    </div>
  )
}
