import { getLatestPosts } from '@/components/mdx/server-utils'
import { H1 } from '@/components/module/home/H1'
import { NormalContainer } from '@/layout/container/Normal'
import { PostsGrid } from './posts-grid'
import { ReadMore } from './read-more'

export async function LatestPosts() {
  const latestBlogs = await getLatestPosts()

  return (
    <NormalContainer className="flex flex-col gap-10">
      <div className="flex-between">
        <H1>Latest Posts</H1>
        <ReadMore link="/posts" />
      </div>
      <PostsGrid posts={latestBlogs} />
    </NormalContainer>
  )
}
