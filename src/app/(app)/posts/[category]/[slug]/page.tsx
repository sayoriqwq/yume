import { getLikeStatus } from '@/components/common/operations/like/action'
import { LikeButton } from '@/components/common/operations/like/like-button'
import { ShareButton } from '@/components/common/operations/share/share-button'
import { CustomMDX } from '@/components/mdx/mdx'
import { getAllPosts, readMDXFile } from '@/components/mdx/posts-utils'
import { ArticleMetadata } from '@/components/module/article/metadata'
import { Title } from '@/components/module/article/title'
import { ViewCountRecord } from '@/components/module/article/view-count-record'
import { getCommentStatus } from '@/components/module/comment/actions'
import { Comments } from '@/components/module/comment/comments'
import { TableOfContents } from '@/components/toc/toc'
import { baseUrl } from '@/config/base-url'
import { getArticleBySlug } from '@/db/article/service'
import { ArticleType } from '@/generated'
import { WiderContainer } from '@/layout/container/Normal'
import { LikeableType } from '@/types'
import { notFound } from 'next/navigation'

// 生成静态路由
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.metadata.slug, category: post.metadata.category }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, category: string }> }) {
  const { category, slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) {
    return
  }
  const ogImage = article.cover
    ? article.cover
    : `/og?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description || '')}`

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
  let mdxContent = ''

  if (article.type === ArticleType.BLOG) {
    const { mdxPath } = article
    if (!mdxPath) {
      return <div>文章内容不存在</div>
    }
    const { content } = await readMDXFile(mdxPath)
    mdxContent = content
  }

  // 并行获取评论和点赞数据以提高性能
  const [commentData, likesData] = await Promise.all([
    getCommentStatus(article.id),
    getLikeStatus(article.id, LikeableType.ARTICLE),
  ])

  const [initialComments, commentsCount] = commentData
  const [initialLiked, initialLikeCount] = likesData

  return (
    <>
      <ViewCountRecord articleId={article.id} />
      <WiderContainer className="grid grid-cols-1 gap-20 xl:grid-cols-[1fr_300px] mt-16">
        <div>
          <article className="prose dark:prose-invert">
            <Title title={article.title} />
            <ArticleMetadata article={article} />
            <CustomMDX source={mdxContent} />
          </article>

          {/* 文章操作区域 */}
          <div className="mt-10 flex items-center justify-end gap-2">
            <LikeButton
              targetId={article.id}
              type={LikeableType.ARTICLE}
              initialLiked={initialLiked}
              initialCount={initialLikeCount}
            />
            <ShareButton title={article.title} />
          </div>

          <Comments
            articleId={article.id}
            initialComments={initialComments}
            initialCount={commentsCount}
          />
        </div>
        <div className="hidden xl:block">
          <TableOfContents />
        </div>
      </WiderContainer>
    </>
  )
}
