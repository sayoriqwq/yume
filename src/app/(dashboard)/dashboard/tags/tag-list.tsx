'use client'

import { useTagsData } from '@/atoms/dashboard/hooks/useTag'
import { useCommandDialog } from '@/components/common/command-dialog'
import { useCommandSheet } from '@/components/common/command-sheet'
import { LoadingIcon } from '@/components/common/loading/loading-icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  Plus,
  RefreshCcw,
  Tag as TagIcon,
  Trash2,
} from 'lucide-react'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'
import { CreateTagForm } from './create-tag-form'
import { TagDetail } from './tag-detail'

export function TagList() {
  const { tagIds, tagMap, isLoading, error, removeTag, mutate } = useTagsData()
  const { present } = useModalStack()
  const { open: openCommandSheet } = useCommandSheet()
  const { open: openCommandDialog, close: closeCommandDialog } = useCommandDialog()

  const showDetailModal = useCallback((id: number) => {
    const tagName = tagMap[id]?.name || '标签详情'
    present({
      title: `${tagName}`,
      content: () => <TagDetail id={id} />,
    })
  }, [present, tagMap])

  const handleCreate = useCallback(() => {
    openCommandSheet({
      title: '新建标签',
      content: <CreateTagForm />,
    })
  }, [openCommandSheet])

  const handleDelete = useCallback(async (id: number) => {
    closeCommandDialog()
    await removeTag(id)
  }, [removeTag, closeCommandDialog])

  const showDeleteDialog = useCallback((id: number) => {
    const tagName = tagMap[id]?.name
    if (!tagName)
      return

    openCommandDialog({
      title: '确认删除',
      description: `您确定要删除标签 "${tagName}" 吗？此操作无法撤销。`,
      onConfirm: () => handleDelete(id),
      confirmText: '删除',
      cancelText: '取消',
    })
  }, [tagMap, handleDelete, openCommandDialog])

  // 计算所有标签中的最大和最小文章数
  const getTagSizeClass = useCallback((count: number) => {
    const counts = tagIds.map(id => tagMap[id]?.count || 0)
    const maxCount = Math.max(...counts, 1)
    const minCount = Math.min(...counts, 0)

    // 计算标签的相对大小 (将大小映射到 0-1 之间)
    const normalizedSize = maxCount === minCount
      ? 0.5
      : (count - minCount) / (maxCount - minCount)

    // 根据归一化的大小，返回不同的尺寸类名
    if (normalizedSize < 0.2)
      return 'text-sm px-2 py-1'
    if (normalizedSize < 0.4)
      return 'text-base px-2.5 py-1.5'
    if (normalizedSize < 0.6)
      return 'text-lg px-3 py-1.5'
    if (normalizedSize < 0.8)
      return 'text-xl px-3.5 py-2'
    return 'text-2xl px-4 py-2.5 font-medium'
  }, [tagIds, tagMap])

  // 获取标签的颜色
  const getTagColorClass = useCallback((id: number) => {
    // 使用标签ID作为种子生成不同的颜色
    const colorOptions = [
      'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'bg-green-100 text-green-800 hover:bg-green-200',
      'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'bg-red-100 text-red-800 hover:bg-red-200',
      'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      'bg-pink-100 text-pink-800 hover:bg-pink-200',
      'bg-teal-100 text-teal-800 hover:bg-teal-200',
    ]
    return colorOptions[id % colorOptions.length]
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingIcon />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-4">
        <div className="text-red-500">
          加载标签列表出错:
          {error.message}
        </div>
        <Button onClick={() => mutate()} variant="outline" className="mt-2">
          <RefreshCcw className="w-4 h-4 mr-2" />
          重试
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">标签管理</h1>
        </div>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          新建标签
        </Button>
      </div>

      {/* 标签统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总标签数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tagIds.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">最多文章的标签</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tagIds.length > 0
                ? tagMap[tagIds.reduce((maxId, id) =>
                  (tagMap[id]?.count || 0) > (tagMap[maxId]?.count || 0) ? id : maxId, tagIds[0])]?.name || '-'
                : '-'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">最近创建的标签</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tagIds.length > 0
                ? tagMap[tagIds[tagIds.length - 1]]?.name || '-'
                : '-'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 标签云 */}
      <Card className="overflow-hidden border shadow-sm">
        <CardHeader>
          <CardTitle>标签云</CardTitle>
        </CardHeader>
        <CardContent>
          {tagIds.length > 0
            ? (
                <div className="flex flex-wrap gap-3 p-3">
                  {tagIds.map((id) => {
                    const tag = tagMap[id]
                    if (!tag)
                      return null

                    const sizeClass = getTagSizeClass(tag.count || 0)
                    const colorClass = getTagColorClass(id)

                    return (
                      <motion.div
                        key={id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group"
                      >
                        <div
                          onClick={() => showDetailModal(id)}
                          className={cn(
                            'rounded-full inline-flex items-center transition-all cursor-pointer',
                            'relative group-hover:shadow-md',
                            sizeClass,
                            colorClass,
                          )}
                        >
                          <span>{tag.name}</span>
                          <span className="ml-1.5 text-xs opacity-70">
                            (
                            {tag.count || 0}
                            )
                          </span>

                          {/* 删除按钮 - 绝对定位到右上角 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              showDeleteDialog(id)
                            }}
                            className="absolute -top-1 -right-1 size-5 rounded-full bg-background shadow border
                                 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center
                                 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            aria-label="删除标签"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )
            : (
                <div className="text-center text-muted-foreground py-10 border border-dashed rounded-md">
                  <TagIcon className="mx-auto h-10 w-10 opacity-20 mb-2" />
                  <p>还没有创建任何标签</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    size="sm"
                    onClick={handleCreate}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    创建第一个标签
                  </Button>
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  )
}
