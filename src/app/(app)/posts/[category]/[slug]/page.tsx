import { LikeButton } from '@/components/common/operations/like-button'
import { getAllPosts } from '@/components/mdx/posts-utils'
import { CommentContainer } from '@/components/module/comment/comment-container'
import { PostDetail } from '@/components/module/post/post-detail'
import { getArticleBySlug } from '@/db/article/service'
import { getArticleComments, getCommentCount } from '@/db/comment/service'
import { getLikeStatus } from '@/db/like/action'
import { LikeableType } from '@/generated'
import { WiderContainer } from '@/layout/container/Normal'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.metadata.slug, category: post.metadata.category }))
}

interface Props {
  params: Promise<{ slug: string, category: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const post = (await getAllPosts()).find(post => post.metadata.slug === slug)

  const article = await getArticleBySlug(slug)

  if (!post || !article) {
    notFound()
  }

  const likeStatus = await getLikeStatus(
    article.id,
    LikeableType.ARTICLE,
  )

  const commentsPromise = getArticleComments(article.id)
  const commentCountPromise = getCommentCount(article.id)

  return (
    <WiderContainer className="bg-background grid grid-cols-1 gap-20 xl:grid-cols-[1fr_300px] mt-16">
      <PostDetail post={post} />
      <div>
        <div className="mt-16 flex justify-end">
          <LikeButton
            targetId={article.id}
            type={LikeableType.ARTICLE}
            initialCount={article._count.likes}
            initialLiked={likeStatus}
            className="hover:scale-110 transition-transform"
          />
        </div>
        <CommentContainer articleId={article.id} commentsPromise={commentsPromise} commentCountPromise={commentCountPromise} />
      </div>
    </WiderContainer>
  )
}
