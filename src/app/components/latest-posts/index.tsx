import { getLatestPosts } from '@/data/post'
import { NormalContainer } from '@/layout/container/Normal'
import { ReadMore } from '../read-more'
import { PostsGrid } from './posts-grid'

export async function LatestPosts() {
  const allPosts = getLatestPosts()

  return (
    <NormalContainer className="flex flex-col gap-10">
      <h1 className="font-aboreto text-3xl font-bold">Latest Posts</h1>
      <PostsGrid posts={allPosts} />
      <ReadMore href="/posts" className="ml-auto" />
    </NormalContainer>
  )
}
