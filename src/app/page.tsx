import { Fcp } from '@/app/components/fcp'
import { LatestPosts } from '@/app/components/latest-posts'

export default function Home() {
  return (
    <main className="relative">
      <Fcp />
      <LatestPosts />
    </main>
  )
}
