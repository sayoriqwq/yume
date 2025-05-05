'use client'

import type { ArticlesResponse } from '@/app/api/articles/route'
import type { Tag as TagModel } from '@/generated'
import { Button } from '@/components/ui/button'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'
import useSWR from 'swr'
import { ArticleRowItem } from './article-row-item'

interface TagsProps {
  tags: TagModel[]
}

export function Tags({ tags }: TagsProps) {
  return (
    <span>
      {tags.map((tag, index) => (
        <span key={tag.id}>
          <Tag name={tag.name} />
          {index < tags.length - 1 && <span className="text-muted-foreground m-1">•</span>}
        </span>
      ))}
    </span>
  )
}

export function TagContent({ name }: { name: string }) {
  const { data, isLoading, error } = useSWR<ArticlesResponse>(
    `/api/articles?tag=${name}`,
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
                <ArticleRowItem key={article.id} article={article} />
              ))}
            </div>
          )}
    </div>
  )
}

export function Tag({ name }: { name: string }) {
  const { present } = useModalStack()

  const showModal = useCallback(() => {
    present({
      title: `标签: ${name}`,
      content: () => <TagContent name={name} />,
    })
  }, [present, name])

  return (
    <Button
      variant="link"
      className="text-md p-0"
      onClick={showModal}
    >
      {name}
    </Button>
  )
}
