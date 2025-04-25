// 静态博客文章类型
// from .mdx

export interface Post {
  metadata: IPostMetaData
  content: string
}

// from matter
export interface IPostMetaData {
  // 针对静态博客而言，slug 则是它的唯一标识
  slug: string
  title: string
  cover: string
  published?: boolean
  description?: string
  // 与 Article 定义不同的地方
  filePath?: string // 处理文章的时候自己带进去
  // 日期是 string 而非 Date 对象
  createdAt: string
  updatedAt: string
  // 相关数据都是字符串
  category: string
  tags?: string[]
}
