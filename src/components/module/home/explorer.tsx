import { LikeButton } from '@/components/common/operations/like/like-button'
import { SITE_FAKE_ARTICLE_ID } from '@/constants/defaults'
import { NormalContainer } from '@/layout/container/Normal'
import Link from 'next/link'
import { H1 } from './H1'

export function Explorer() {
  return (
    <NormalContainer className="flex-center flex-col gap-12 py-10">
      <H1>Where to go?</H1>

      <div className="flex flex-wrap justify-center gap-6">
        <Link
          href="/notes"
          className="relative flex h-14 w-32 flex-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 px-6 py-3 text-lg font-medium text-primary shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-primary/20 active:translate-y-0 dark:from-primary/20 dark:to-primary/30"
        >
          随记
        </Link>
        <Link
          href="/posts/draft"
          className="relative flex h-14 w-32 flex-center rounded-lg bg-gradient-to-br from-accent/10 to-accent/20 px-6 py-3 text-lg font-medium text-accent shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-accent/20 active:translate-y-0 dark:from-accent/20 dark:to-accent/30"
        >
          短文
        </Link>
      </div>

      <div className="mt-4 flex flex-col items-center gap-5 border-t border-border/40 pt-8">
        <span className="font-serif text-muted-foreground animate-fade-in">喜欢本站吗？给我点个赞吧！</span>
        <div className="transform transition-transform hover:scale-105">
          <LikeButton targetId={SITE_FAKE_ARTICLE_ID} />
        </div>
      </div>
    </NormalContainer>
  )
}
