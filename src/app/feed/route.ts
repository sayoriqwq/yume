import RSS from 'rss'
import { siteConfig } from '@/config/site'
import { getAllPosts } from '@/data/post'

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

  const allPosts = getAllPosts()

  allPosts.forEach((post) => {
    const url = `${siteConfig.url}/posts/${post.slug}`

    feed.item({
      title: post.title,
      description: post.description || '',
      url,
      guid: url,
      categories: post.tags || [],
      date: new Date(post.createdAt),
      enclosure: post.cover
        ? { url: post.cover, type: 'image/webp' }
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
