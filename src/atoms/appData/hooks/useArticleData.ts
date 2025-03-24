import { useAtomValue } from 'jotai'
import useSWR from 'swr'
import { useNormalizeResponse } from '../normalize'
import { articlesAtom, articleTagsAtom, categoriesAtom, tagsAtom } from '../store'

export function useArticleData(articleId: number) {
  const normalizeResponse = useNormalizeResponse()
  const articles = useAtomValue(articlesAtom)
  const categories = useAtomValue(categoriesAtom)
  const tags = useAtomValue(tagsAtom)
  const articleTags = useAtomValue(articleTagsAtom)

  // 使用SWR获取数据
  const { isLoading, error } = useSWR(
    // 如果已经有数据，可以跳过请求
    articles[articleId] ? null : `/api/articles/${articleId}`,
    {
      onSuccess: (data) => {
        // 规范化并存储响应数据
        normalizeResponse(data)
      },
    },
  )

  // 获取完整的文章与其关系
  const article = articles[articleId]
  const category = article ? categories[article.categoryId] : null
  const articleTagIds = articleTags[articleId] || []
  const relatedTags = articleTagIds.map(tagId => tags[tagId]).filter(Boolean)

  return {
    isLoading,
    error,
    article,
    category,
    tags: relatedTags,
  }
}
