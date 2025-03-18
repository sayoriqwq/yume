import { CustomMDX } from '@/components/mdx/mdx'
import { PostHeader } from '@/components/mdx/post-header'
import { getAllPosts } from '@/components/mdx/utils'
import { CommentContainer } from '@/components/module/comment/comment-container'
import { TableOfContents } from '@/components/toc/toc'
import { WiderContainer } from '@/layout/container/Normal'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = getAllPosts()

  return posts.map(post => ({
    slug: post.slug,
  }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const post = getAllPosts().find(post => post.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <WiderContainer className="bg-background grid grid-cols-1 gap-20 xl:grid-cols-[1fr_300px] mt-16">
      <article className="prose dark:prose-invert @md:p-10">
        <PostHeader metadata={post.metadata} />
        <CustomMDX source={post.content} />
      </article>
      <div className="lg:block hidden">
        <TableOfContents />
      </div>
      <CommentContainer articleId={post.metadata.id} />
    </WiderContainer>
  )
}
