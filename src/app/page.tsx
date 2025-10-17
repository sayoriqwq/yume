import { Fcp } from '@/components/module/home/fcp'
import { LatestPosts } from '@/components/module/home/latest-posts'

export default function Home() {
  return (
    <main className="relative">
      <Fcp />
      <LatestPosts />
    </main>
  )
}
