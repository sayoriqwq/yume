'server-only'

import type { IPostMetaData, Post } from '@/types/article/post'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { errorLogger } from '@/lib/error-handler'
// import { sleep } from '@/lib/utils'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import matter from 'gray-matter'

// 缓存变量
let postsCache: Post[] | null = null

/**
 * 获取指定目录下的所有MDX文件
 */
export async function getMDXFiles(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir).catch((error) => {
    const yumeError = createYumeError(error, YumeErrorType.FileSystemError)
    errorLogger(yumeError)
    throw yumeError
  })
  return files.filter(file => path.extname(file) === '.mdx')
}

/**
 * 读取并解析MDX文件内容
 */
export async function readMDXFile(filePath: string) {
  const rawContent = await fs.readFile(filePath, 'utf-8').catch((error) => {
    const yumeError = createYumeError(error, YumeErrorType.FileSystemError)
    errorLogger(yumeError)
    throw yumeError
  })
  // 使用 gray-matter 解析文件内容
  return matter(rawContent)
}

/**
 * 处理单个MDX文件
 */
async function processFile(dir: string, file: string): Promise<Post> {
  const filePath = path.join(dir, file)
  const { data: metadata, content } = await readMDXFile(filePath)
  return {
    metadata: { ...metadata, filePath } as IPostMetaData,
    content,
  }
}

/**
 * 获取指定目录下所有MDX文件的数据
 */
export async function getMDXData(dir: string): Promise<Post[]> {
  const files = await getMDXFiles(dir)
  return Promise.all(files.map(file => processFile(dir, file)))
}

export const fullPath = path.join(process.cwd(), 'public', 'contents', 'blogs')
export const relativePath = path.relative(process.cwd(), fullPath)

/**
 * 获取所有文章（缓存版本）
 */
export async function getAllPosts(): Promise<Post[]> {
  if (postsCache) {
    return postsCache
  }
  // await sleep(3000)
  const posts = await getMDXData(fullPath)
  postsCache = posts
  return posts
}

/**
 * 清除文章缓存
 * 在需要刷新文章数据时调用（如新增、修改或删除文章）
 */
export function clearPostsCache(): void {
  postsCache = null
}
