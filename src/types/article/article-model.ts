// 后端文章类型
import type { Article as ArticleModel } from '@/generated'

export type Draft = Omit<ArticleModel, 'type' | 'mood' | 'weather' | 'location' | 'mdxPath'>

export type Note = Omit<ArticleModel, 'type' | 'tags' | 'mdxPath'>

export type Blog = Omit<ArticleModel, 'type' | 'mood' | 'weather' | 'location'>
