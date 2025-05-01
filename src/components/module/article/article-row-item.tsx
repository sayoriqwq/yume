import type { ArticleWithCategory } from '@/types/article/article-model'
import { NormalTime } from '@/components/common/time'
import Link from 'next/link'

interface ArticleRowItemProps {
  article: ArticleWithCategory
}

function getArticleLink(article: ArticleWithCategory) {
  switch (article.type) {
    // 静态博客路径
    case 'BLOG':
      return `/posts/${article.category.name}/${article.slug}`
    case 'DRAFT':
      return `/drafts/${article.id}`
    case 'NOTE':
      return `/notes/${article.id}`
    default:
      return '#'
  }
}

export function ArticleRowItem({ article }: ArticleRowItemProps) {
  return (
    <Link
      className="flex-between gap-4 group"
      href={getArticleLink(article)}
    >
      <span className="group-hover:text-accent transition-all duration-300">
        {article.title}
      </span>
      <NormalTime date={article.createdAt} />
    </Link>
  )
}
