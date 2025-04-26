import type { Post } from '@/types/article/post'
import { CustomMDX } from '@/components/mdx/mdx'
import { PostHeader } from '@/components/mdx/post-header'
import { TableOfContents } from '@/components/toc/toc'

interface PostDetailProps {
  post: Post
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <>
      <article className="prose dark:prose-invert @md:p-10">
        <PostHeader metadata={post.metadata} />
        <CustomMDX source={post.content} />
      </article>
      <div className="xl:block hidden">
        <TableOfContents />
      </div>
    </>
  )
}
