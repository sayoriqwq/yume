'use client'

import { useCategoriesData } from '@/atoms/dashboard/hooks/useCategory'
import { useCommandDialog } from '@/components/common/command-dialog'
import { useCommandSheet } from '@/components/common/command-sheet'
import { siteConfig } from '@/config/site'
import { Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'
import { CategoryDetail } from './category-detail'
import { CreateCategoryForm } from './create-category-form'

export function CategoryList() {
  const { categoryIds, categoryMap, isLoading, error, removeCategory } = useCategoriesData()
  const { present } = useModalStack()
  const { open: openCommandSheet } = useCommandSheet()
  const { open: openCommandDialog, close: closeCommandDialog } = useCommandDialog()

  const showModal = useCallback((id: number) => {
    console.log(id, 'showModal')
    present({
      title: `分类详情: ${categoryMap[id].name}`,
      content: () => <CategoryDetail id={id} />,
    })
  }, [present, categoryMap])

  const handleCreate = useCallback(() => {
    openCommandSheet({
      title: '新建分类',
      content: <CreateCategoryForm />,
    })
  }, [openCommandSheet])

  const handleDelete = useCallback(async (id: number) => {
    closeCommandDialog()
    await removeCategory(id)
  }, [removeCategory, closeCommandDialog])

  const showDeleteDialog = useCallback((id: number) => {
    openCommandDialog({
      title: '确认删除',
      description: `您确定要删除分类"${categoryMap[id].name}"吗？此操作无法撤销。`,
      onConfirm: () => handleDelete(id),
      confirmText: '删除',
      cancelText: '取消',
    })
  }, [categoryMap, handleDelete, openCommandDialog])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-500">加载出错</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">文章分类</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新建分类
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryIds.map(id => (
          <div
            key={id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer group relative"
            onClick={() => showModal(id)}
          >
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                <Image
                  src={categoryMap[id]?.cover || siteConfig.avatar}
                  alt={categoryMap[id]?.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                  {categoryMap[id]?.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {categoryMap[id]?.articleIds?.length || 0}
                  {' '}
                  篇文章
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                showDeleteDialog(id)
              }}
              className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
              aria-label="删除分类"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
