import { getAllPosts } from '@/components/mdx/utils'
import { PostList } from '@/components/module/post/post-list'
import { NormalContainer } from '@/layout/container/Normal'

export default async function BlogPage() {
  const posts = getAllPosts()

  return (
    <NormalContainer className="mt-10 grid grid-cols-1">
      <PostList posts={posts} />
    </NormalContainer>
  )
}
