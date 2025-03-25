'use client'

import { Button } from '@/components/ui/button'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'
import useSWR from 'swr'

interface CategoryProps {
  name: string
}

interface Article {
  id: number
  title: string
  slug: string
  description: string | null
  category: {
    id: number
    name: string
    cover: string | null
  }
  tags: Array<{
    id: number
    name: string
  }>
  createdAt: string
  updatedAt: string
}

function CategoryContent({ name }: { name: string }) {
  const { data, isLoading, error } = useSWR<{ articles: Article[] }>(
    `/api/categories/by-name/${name}/articles`,
    (url: string) => fetch(url).then(res => res.json()),
  )

  if (isLoading) {
    return (
      <div className="min-h-[200px] w-full flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        加载失败：
        {error.message || '未知错误'}
      </div>
    )
  }

  const articles = data?.articles || []

  return (
    <div className="space-y-4">
      {articles.length === 0
        ? (
            <p>没有找到相关文章</p>
          )
        : (
            <div className="space-y-2">
              {articles.map(article => (
                <div key={article.id} className="p-3 border rounded">
                  <a href={`/posts/${article.category.name}/${article.slug}`} className="font-medium hover:underline">
                    {article.title}
                  </a>
                  {article.description && (
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
    </div>
  )
}

export function Category({ name }: CategoryProps) {
  const { present } = useModalStack()

  const showModal = useCallback(() => {
    present({
      title: `Category: ${name}`,
      content: () => <CategoryContent name={name} />,
    })
  }, [present, name])

  return (
    <Button
      variant="link"
      className="p-1 text-md"
      onClick={showModal}
    >
      #
      {name}
    </Button>
  )
}
