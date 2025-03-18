import { DraftsActGrid } from '@/components/module/home/drafts-act-grid'
import { Explorer } from '@/components/module/home/explorer'
import { Fcp } from '@/components/module/home/fcp'
import { LatestPosts } from '@/components/module/home/latest-posts'

export default function Home() {
  return (
    <main className="relative">
      <Fcp />
      <LatestPosts />
      <DraftsActGrid />
      <Explorer />
    </main>
  )
}
