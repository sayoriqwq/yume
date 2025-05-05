import type { Article } from '@/generated'
import { ClientMDX } from '@/components/mdx/client-mdx'
import { CustomMDX } from '@/components/mdx/mdx'
import { readMDXFile } from '@/components/mdx/posts-utils'
import { ArticleType } from '@/generated'
import { notFound } from 'next/navigation'

interface ArticleContentProps {
  article: Article
}

// 主要是用来加载不同源的数据 & 选择不同的组件
export async function ArticleContent({ article }: ArticleContentProps) {
  let mdxContent = ''
  if (article.type === ArticleType.BLOG) {
    const { mdxPath } = article
    if (!mdxPath) {
      notFound()
    }
    const { content } = await readMDXFile(mdxPath)
    mdxContent = content
    return <CustomMDX source={mdxContent} />
  }
  else {
    if (!article.content) {
      notFound()
    }
    return (
      <ClientMDX markdown={article.content} />
    )
  }
}
