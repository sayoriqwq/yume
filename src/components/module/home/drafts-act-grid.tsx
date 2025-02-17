import { getAllPosts } from '@/components/mdx/utils'
import { NormalContainer } from '@/layout/container/Normal'
import { Activities } from './activities'
import { Drafts } from './drafts'

export function DraftsActGrid() {
  const posts = getAllPosts()
  return (
    <NormalContainer className="grid grid-cols-1 gap-16 md:grid-cols-[3fr_2fr]">
      <Drafts posts={posts} />
      <Activities />
    </NormalContainer>
  )
}
