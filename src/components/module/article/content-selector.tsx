import type { Article } from '@/generated'
import { ClientMDX } from '@/components/mdx/client-mdx'
import { CustomMDX } from '@/components/mdx/mdx'
import { readMDXFile } from '@/components/mdx/posts-utils'
import { ArticleType } from '@/generated'

interface ContentSelectorProps {
  article: Article
}

export async function ContentSelector({ article }: ContentSelectorProps) {
  if (article.type === ArticleType.BLOG) {
    const { mdxPath } = article
    if (!mdxPath) {
      return <div>文章内容不存在</div>
    }
    const { content } = await readMDXFile(mdxPath)
    return <CustomMDX source={content} />
  }
  else {
    if (!article.content) {
      return <div>文章内容不存在</div>
    }
    return <ClientMDX markdown={article.content} />
  }
}
