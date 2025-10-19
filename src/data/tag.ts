import type { Post, Tag } from '#site/content'
import { posts, tags } from '#site/content'

export function getAllTags(): Tag[] {
  return tags
}

export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find(tag => tag.slug === slug)
}

export function getTagMap(): Record<string, Tag> {
  return Object.fromEntries(tags.map(tag => [tag.slug, tag]))
}

export function getAllTagSlugs(): string[] {
  return tags.map(tag => tag.slug)
}

export function getPostsByTagSlugs(slugs: string[]): Post[] {
  if (slugs.length === 0)
    return []

  const matcher = new Set(slugs)
  return posts.filter((post) => {
    if (!post.tags?.length)
      return false

    return post.tags.some(tagSlug => matcher.has(tagSlug))
  })
}
