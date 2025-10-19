import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ModeToggle } from '@/components/common/operations/mode-toggle'
import { getAllPostSlugs, getPostBySlug } from '@/data/post'
import { MDXContent } from '@/features/mdx/mdx-content'
import { TocView } from '@/features/mdx/toc/toc-view'
import { getMinDepth } from '@/features/mdx/types/transform'
import { NormalContainer } from '@/layout/container/Normal'

export function generateStaticParams() {
  return getAllPostSlugs().map(slug => ({ slug }))
}

interface BlogPostProps {
  params: Promise<{ slug: string }>
}
export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params
  if (!slug)
    return notFound()
  const post = getPostBySlug(slug)

  if (!post)
    return notFound()

  const minDepth = getMinDepth(post.tocFlatten)

  return (
    <NormalContainer>
      <header className="mb-6 flex flex-col gap-4">
        {post.cover
          ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>
            )
          : null}
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <ModeToggle />
        </div>
      </header>
      {/* 正文 + 右侧目录布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-8">
        <MDXContent code={post.code} />
        <div className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          <TocView flat={post.tocFlatten} minDepth={minDepth} />
        </div>
      </div>
    </NormalContainer>
  )
}
