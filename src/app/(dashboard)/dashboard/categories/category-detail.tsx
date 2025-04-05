'use client'

import { useArticlesData } from '@/atoms/dashboard/hooks/useArticle'
import { useCategoriesData, useCategoryDetail } from '@/atoms/dashboard/hooks/useCategory'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { siteConfig } from '@/config/site'
import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function CategoryDetail({ id }: { id: number }) {
  console.log('CategoryDetail', id)
  const { category, articleIds, isLoading, error } = useCategoryDetail(id)
  const { articleMap } = useArticlesData()
  const { updateCategory } = useCategoriesData()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(category?.name || '')

  const handleNameSubmit = async () => {
    setIsEditing(false)
    try {
      await updateCategory(id, { name })
      toast.success('更新成功')
    }
    catch (error) {
      toast.error('更新失败')
      console.error('更新失败:', error)
    }
  }

  const handleCancel = () => {
    setName(category?.name || '')
    setIsEditing(false)
  }

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
        <div className="text-red-500">加载失败</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
          <Image
            src={category.cover || siteConfig.avatar}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          {isEditing
            ? (
                <div className="space-y-2">
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleNameSubmit()
                      }
                    }}
                    autoFocus
                    className="text-2xl font-bold"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleNameSubmit} size="sm">
                      保存
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      取消
                    </Button>
                  </div>
                </div>
              )
            : (
                <h2
                  className="text-2xl font-bold mb-2 cursor-pointer hover:text-primary transition-colors"
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {category.name}
                </h2>
              )}
          <p className="text-gray-500">
            共
            {' '}
            {category.count}
            {' '}
            篇文章
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">文章列表</h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {articleIds.map(articleId => (
              <Card key={articleId} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{articleMap[articleId].title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(articleMap[articleId].createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
