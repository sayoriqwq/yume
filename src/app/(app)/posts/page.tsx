import { getAllPosts } from '@/components/mdx/posts-utils'
import { PostCardList } from '@/components/module/post/post-card-list'
import { NormalContainer } from '@/layout/container/Normal'

export default async function Page() {
  const posts = (await getAllPosts()).filter(post => post.metadata.published)

  return (
    <NormalContainer className="mt-10 grid grid-cols-1">
      <PostCardList posts={posts} />
    </NormalContainer>
  )
}
