import { getAllPosts } from '@/components/mdx/server-utils'
import { CommentContainer } from '@/components/module/comment/comment-container'
import { PostDetail } from '@/components/module/post/post-detail'
import { WiderContainer } from '@/layout/container/Normal'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = getAllPosts()

  return posts.map(post => ({
    slug: post.metadata.slug,
  }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const post = getAllPosts().find(post => post.metadata.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <WiderContainer className="bg-background grid grid-cols-1 gap-20 xl:grid-cols-[1fr_300px] mt-16">
      <PostDetail post={post} />
      <CommentContainer articleSlug={post.metadata.slug} />
    </WiderContainer>
  )
}
