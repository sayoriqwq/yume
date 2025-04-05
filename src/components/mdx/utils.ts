import type { IPostMetaData, Post } from '@/types/post'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'

export function slugify(title: string) {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/-{2,}/g, '-')
}

export function getMDXFiles(dir: string): string[] {
  return fs.readdirSync(dir).filter(file => path.extname(file) === '.mdx')
}

export function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return matter(rawContent)
}

export function getMDXData(dir: string): Post[] {
  const mdxFiles = getMDXFiles(dir)

  return mdxFiles.map((file) => {
    const { data: metadata, content } = readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))
    return {
      metadata: { ...metadata, slug } as IPostMetaData,
      content,
    }
  })
}

export const fullPath = path.join(process.cwd(), 'contents')

export function getAllPosts(): Post[] {
  return getMDXData(fullPath)
}

export function getLatestPosts(num = 4): Post[] {
  const posts = getAllPosts()
  const sortPosts = (posts: Post[]) =>
    posts.sort((a, b) => {
      const dateA = new Date(a.metadata.createdAt)
      const dateB = new Date(b.metadata.createdAt)
      return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
    })
  return sortPosts(posts).slice(0, num)
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(post => post.metadata.category === category)
}
