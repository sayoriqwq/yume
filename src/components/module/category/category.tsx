'use client'

import type { ArticlesResponse } from '@/app/api/articles/route'
import type { Article } from '@/types/article/article'
import { Button } from '@/components/ui/button'
import { formatArticle } from '@/types/article/format'
import Link from 'next/link'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'
import useSWR from 'swr'

function CategoryContent({ name }: { name: string }) {
  const { data, isLoading, error } = useSWR<ArticlesResponse>(
    `/api/categories/by-name/${name}`,
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
  const getArticleLink = (article: Article) => {
    switch (article.type) {
      case 'BLOG':
        return `/posts/${article.category}/${article.slug}`
      case 'DRAFT':
        return `/drafts/${article.id}`
      case 'NOTE':
        return `/notes/${article.id}`
      default:
        return '#'
    }
  }

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
                  <Link href={getArticleLink(formatArticle(article))} className="font-medium hover:underline">
                    {article.title}
                  </Link>
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

export function Category({ name }: { name: string }) {
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
