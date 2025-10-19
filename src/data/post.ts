import type { Post } from '#site/content'
import { posts } from '#site/content'

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug)
}

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getLatestPosts(count = 4): Post[] {
  return getAllPosts().slice(0, count)
}

export function getAllPostSlugs(): string[] {
  return posts.map(p => p.slug)
}
