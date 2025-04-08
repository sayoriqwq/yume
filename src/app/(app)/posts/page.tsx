import { getAllPosts } from '@/components/mdx/server-utils'
import { PostCardList } from '@/components/module/post/post-card-list'
import { NormalContainer } from '@/layout/container/Normal'

export default async function Page() {
  const posts = getAllPosts()

  return (
    <NormalContainer className="mt-10 grid grid-cols-1">
      <PostCardList posts={posts} />
    </NormalContainer>
  )
}
