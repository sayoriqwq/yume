'use client'

import type { Article } from '@/atoms/appData/store'
import { useCategoryByName } from '@/atoms/appData/hooks/useCategories'
import { useNormalizeResponse } from '@/atoms/appData/normalize'
import { articlesAtom, categoriesAtom } from '@/atoms/appData/store'

import { Button } from '@/components/ui/button'
import { useAtomValue } from 'jotai'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'
import useSWR from 'swr'

interface CategoryProps {
  name: string
}

interface CategoryContentProps {
  categoryId: number
}

interface CategoryArticlesResponse {
  data: {
    categoryId: number
    articleIds: number[]
  }
  objects: {
    articles: Record<number, Article>
  }
}

function CategoryContent({ categoryId }: CategoryContentProps) {
  const articles = useAtomValue(articlesAtom)
  const categories = useAtomValue(categoriesAtom)
  const normalizeResponse = useNormalizeResponse()

  // 获取分类相关文章
  const { data, isLoading } = useSWR<CategoryArticlesResponse['data']>(
    `/api/categories/${categoryId}/articles`,
    async (url: string) => {
      const res = await fetch(url)
      const data = await res.json()

      // 规范化并存储数据
      normalizeResponse(data)
      return data.data
    },
  )

  // 从集中存储中获取该分类的文章
  const categoryArticles = Object.values(articles).filter((article) => {
    return article.categoryId === categoryId || data?.articleIds?.includes(article.id)
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
      <h3 className="text-lg font-medium">
        分类"
        {categories[categoryId]?.name}
        "的文章
      </h3>
      {categoryArticles.length === 0
        ? (
            <p>没有找到相关文章</p>
          )
        : (
            <div className="space-y-2">
              {categoryArticles.map(article => (
                <div key={article.id} className="p-3 border rounded">
                  <a href={`/posts/${article.category || categories[article.categoryId]?.name}/${article.slug}`} className="font-medium hover:underline">
                    {article.title}
                  </a>
                  <div className="mt-1 flex items-center gap-2">
                    {/* 文章描述 */}
                    {article.description && (
                      <p className="text-sm text-gray-500">{article.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  )
}

export function Category({ name }: CategoryProps) {
  const { present } = useModalStack()
  const categories = useAtomValue(categoriesAtom)

  // 预加载并查找分类ID
  const { data: categoryData, isLoading } = useCategoryByName(name)
  const categoryId = categoryData?.data?.categoryId

  // 调试用
  console.log('Category Component Debug:', {
    name,
    categoriesAtomValue: categories,
    categoryIdFromAPI: categoryId,
  })

  const showModal = useCallback(() => {
    if (!categoryId) {
      console.error(`找不到名为 "${name}" 的分类ID`)
      return
    }

    present({
      title: `分类: ${name}`,
      content: () => <CategoryContent categoryId={categoryId} />,
    })
  }, [present, name, categoryId])

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
      disabled={!categoryId}
    >
      {name}
    </Button>
  )
}
