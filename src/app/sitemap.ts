import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { getArticles } from '@/db/article/service'

export const revalidate = 86400 // 24小时更新

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // 基础路由
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date().toISOString(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/friend`,
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/message`,
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
  ]

  const { articles } = await getArticles({ page: 1, limit: 100, published: true })

  const articleRoutes = articles.map((article) => {
    return {
      url: `${baseUrl}/posts/${article.category}/${article.slug}`,
      lastModified: article.updatedAt || article.createdAt,
      priority: article.type === 'BLOG' ? 0.9 : 0.8,
    }
  })

  return [...routes, ...articleRoutes]
}
