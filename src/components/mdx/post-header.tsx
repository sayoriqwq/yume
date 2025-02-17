import type { IPostMetaData } from '@/types/post'

export function PostHeader({ metadata }: { metadata: IPostMetaData }) {
  return (
    <div className="flex-center flex-col text-center">
      <h1 className="text-2xl font-extrabold tracking-tight xl:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
        {metadata.title}
      </h1>

      <p className="text-muted-foreground">
        发布于
        {' '}
        {metadata.publishedAt}
      </p>

      <p className="text-muted-foreground bg-muted max-w-2xl mx-auto p-4 leading-relaxed border-l-4 border-primary/90 rounded-xl">
        {metadata.summary}
      </p>
    </div>
  )
}
