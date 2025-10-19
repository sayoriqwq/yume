import { LatestPosts } from '@/app/components/latest-posts'
import { WiderContainer } from '@/layout/container/Normal'
import Fcp from './components/fcp'

export default function Home() {
  return (
    <main>
      <Fcp />
      <WiderContainer>
        <LatestPosts />
      </WiderContainer>
    </main>
  )
}
