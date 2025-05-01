import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

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

  return routes
}
