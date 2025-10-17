import { ArticleContainer } from '@/components/module/article/article-container'
import { ViewCountRecord } from '@/components/module/article/view-count-record'
import { baseUrl } from '@/config/base-url'
import { siteConfig } from '@/config/site'
import { getArticleBySlug, getArticles } from '@/db/article/service'
import { notFound } from 'next/navigation'

// 生成静态路由
export async function generateStaticParams() {
  const { articles } = await getArticles({ page: 1, limit: 100, published: true })
  return articles.map(article => ({
    slug: article.slug,
    category: article.category.name,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, category: string }> }) {
  const { category, slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) {
    return
  }
  const ogImage = article.cover
    ? article.cover
    : `${baseUrl}/og?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description || '')}`

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.createdAt,
      url: `${baseUrl}/posts/${category}/${slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [ogImage],
    },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': article.title,
        'datePublished': article.createdAt,
        'dateModified': article.updatedAt || article.createdAt,
        'description': article.description || siteConfig.description,
        'image': article.cover
          ? article.cover
          : `${baseUrl}/og?title=${encodeURIComponent(article.title)}`,
        'url': `${baseUrl}/posts/${category}/${slug}`,
        'author': {
          '@type': 'Person',
          'name': siteConfig.author,
        },
      }),
    },
  }
}

interface Props {
  params: Promise<{ slug: string, category: string }>
}

// 布局组件，组合文章 content、交互信息、metadata
// 在这个组件里，不可以使用 headers
/*
  Error: Dynamic server usage: Route /posts/[category]/[slug] couldn't be rendered statically because it used headers. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
*/
// 在这里可以获取到 slug 和 category
export default async function Page({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) {
    notFound()
  }

  return (
    <>
      <ViewCountRecord articleId={article.id} />
      <ArticleContainer article={article} />
    </>
  )
}
