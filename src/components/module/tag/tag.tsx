'use client'

import type { Article, Category } from '@/atoms/appData/store'
import { useTags } from '@/atoms/appData/hooks/useTags'
import { useNormalizeResponse } from '@/atoms/appData/normalize'
import { articlesAtom, categoriesAtom, tagsAtom } from '@/atoms/appData/store'

import { Button } from '@/components/ui/button'
import { useAtomValue } from 'jotai'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'
import useSWR from 'swr'

interface TagProps {
  name: string
}

interface TagContentProps {
  tagId: number
}

interface TagArticlesResponse {
  data: {
    tagId: number
    articleIds: number[]
  }
  objects: {
    articles: Record<number, Article>
    categories: Record<number, Category>
  }
}

function TagContent({ tagId }: TagContentProps) {
  const articles = useAtomValue(articlesAtom)
  const categories = useAtomValue(categoriesAtom)
  const normalizeResponse = useNormalizeResponse()

  const { data, isLoading } = useSWR<TagArticlesResponse['data']>(
    `/api/tags/${tagId}/articles`,
    async (url: string) => {
      const res = await fetch(url)
      const data = await res.json()

      normalizeResponse(data)
      return data.data
    },
  )

  const tagArticles = Object.values(articles).filter((article) => {
    return data?.articleIds?.includes(article.id)
  })

  if (isLoading) {
    return (
      <div className="min-h-[200px] w-full flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tagArticles.length === 0
        ? (
            <p>没有找到相关文章</p>
          )
        : (
            <div className="space-y-2">
              {tagArticles.map(article => (
                <div key={article.id} className="p-3 border rounded">
                  <a href={`/posts/${article.category || categories[article.categoryId]?.name}/${article.slug}`} className="font-medium hover:underline">
                    {article.title}
                  </a>
                  <div className="mt-1 flex items-center gap-2">
                    {article.categoryId && categories[article.categoryId] && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {categories[article.categoryId].name}
                      </span>
                    )}
                    {article.description && (
                      <p className="text-sm text-muted-foreground">{article.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  )
}

export function Tag({ name }: TagProps) {
  const { present } = useModalStack()
  const tags = useAtomValue(tagsAtom)

  const { isLoading } = useTags()

  const tagEntry = Object.entries(tags).find(([_, tag]) => tag.name === name)
  const tagId = tagEntry ? Number(tagEntry[0]) : undefined

  const showModal = useCallback(() => {
    if (!tagId) {
      console.error(`找不到名为 "${name}" 的标签ID`)
      return
    }

    present({
      title: `标签: ${name}`,
      content: () => <TagContent tagId={tagId} />,
    })
  }, [present, name, tagId])

  if (isLoading) {
    return (
      <Button
        variant="link"
        className="p-1 text-md opacity-70"
        disabled
      >
        {name}
      </Button>
    )
  }

  return (
    <Button
      variant="link"
      className="p-1 text-md"
      onClick={showModal}
      disabled={!tagId}
    >
      {name}
    </Button>
  )
}
