import { getAllPosts } from '@/components/mdx/posts-utils'
import { siteConfig } from '@/config/site'
import RSS from 'rss'

export async function GET() {
  const feed = new RSS({
    title: siteConfig.name,
    description: siteConfig.description,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/feed`,
    language: 'zh-CN',
    image_url: siteConfig.avatar,
    copyright: `© ${new Date().getFullYear()} ${siteConfig.author}`,
    pubDate: new Date().toUTCString(),
    generator: 'Next.js',
  })

  const allPosts = (await getAllPosts())
    .filter(post => post.metadata.published !== false)
    .sort((a, b) => {
      return new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
    })

  allPosts.forEach((post) => {
    const { metadata } = post
    const url = `${siteConfig.url}/posts/${metadata.category}/${metadata.slug}`

    feed.item({
      title: metadata.title,
      description: metadata.description || '',
      url,
      guid: url,
      categories: metadata.tags || [],
      date: new Date(metadata.createdAt),
      enclosure: metadata.cover
        ? { url: metadata.cover, type: 'image/jpeg' }
        : undefined,
      author: siteConfig.author,
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
