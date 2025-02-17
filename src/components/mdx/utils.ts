import type { IPostMetaData, Post } from '@/types/post'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'

function getMDXFiles(dir: string): string[] {
  return fs.readdirSync(dir).filter(file => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return matter(rawContent)
}

function getMDXData(dir: string): Post[] {
  const mdxFiles = getMDXFiles(dir)

  return mdxFiles.map((file) => {
    const { data: metadata, content } = readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))
    return {
      metadata: metadata as IPostMetaData,
      slug,
      content,
    }
  })
}

const fullPath = path.join(process.cwd(), 'contents')

export function getAllPosts(): Post[] {
  return getMDXData(fullPath)
}

export function getLatestPosts(num = 4): Post[] {
  const posts = getAllPosts()
  const sortPosts = (posts: Post[]) =>
    posts.sort((a, b) => {
      const dateA = new Date(a.metadata.publishedAt)
      const dateB = new Date(b.metadata.publishedAt)
      return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
    })
  return sortPosts(posts).slice(0, num)
}

export function getAllPostsByCategory(category: string): Post[] {
  // console.log(getAllPosts().filter(post => post.metadata.category === category))
  return getAllPosts().filter(post => post.metadata.category === category)
}
