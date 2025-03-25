import type { Article, Category, RootState, Tag, User } from './store'
import { useSetAtom } from 'jotai'
import { storeAtom } from './store'

interface NormalizedApiResponse {
  data?: {
    tagIds?: number[]
    articleIds?: number[]
    tagId?: number
    [key: string]: any
  }
  objects?: {
    users?: Record<string, User>
    categories?: Record<number, Category>
    tags?: Record<number, Tag>
    articles?: Record<number, Article>
    [key: string]: any
  }
}

export function useNormalizeResponse() {
  const setStore = useSetAtom(storeAtom)

  return (response: NormalizedApiResponse) => {
    const { data, objects } = response

    setStore((prev: RootState) => {
      const newState = { ...prev }

      if (objects?.categories) {
        newState.categories = { ...newState.categories, ...objects.categories }
      }

      if (objects?.tags) {
        newState.tags = { ...newState.tags, ...objects.tags }
      }

      if (objects?.articles) {
        newState.articles = { ...newState.articles, ...objects.articles }
      }

      // 处理文章-标签关联关系
      if (data?.articleIds && data?.tagId) {
        // 更新特定标签的文章列表
        newState.articleTags = { ...newState.articleTags }
        data.articleIds.forEach((articleId: number) => {
          if (!newState.articleTags[articleId]) {
            newState.articleTags[articleId] = []
          }
          if (!newState.articleTags[articleId].includes(data.tagId!)) {
            newState.articleTags[articleId] = [...newState.articleTags[articleId], data.tagId!]
          }
        })
      }

      return newState
    })
  }
}
