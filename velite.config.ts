import type { Collection, UserConfig } from 'velite'
import type { TocEntry } from '@/features/mdx/types'
import rehypeShiki from '@shikijs/rehype'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import { defineConfig, s } from 'velite'
import { rehypeAutolinkHeadingsOptions } from '@/features/mdx/plugins/rehype-autolink-headings'
import { rehypeShikiOption } from '@/features/mdx/plugins/rehype-shiki'
import { flatten } from '@/features/mdx/types/transform'
import { syncAssets } from './src/service/cloudflare-r2'

function computedFields<T extends { tocEntry: TocEntry }>(data: T) {
  return {
    ...data,
    tocFlatten: flatten(data.tocEntry),
  }
}

const posts = {
  name: 'Post',
  pattern: 'posts/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.slug('post'),
      description: s.string().max(300).optional(),
      createdAt: s.isodate(),
      updatedAt: s.isodate().optional(),
      tags: s.array(s.string()).max(10).default([]),
      metadata: s.metadata(),
      cover: s.string().optional(),
      code: s.mdx(),
      tocEntry: s.toc(),
    })
    .transform(computedFields),
} satisfies Collection

const tags = {
  name: 'Tag',
  pattern: 'tags/*.json',
  schema: s.object({
    title: s.string().max(40),
    slug: s.slug('tag'),
    description: s.string().max(160).optional(),
  }),
} satisfies Collection

const config = {
  collections: {
    posts,
    tags,
  },
  mdx: {
    rehypePlugins: [
      [rehypeShiki, rehypeShikiOption],
      rehypeSlug,
      [rehypeAutolinkHeadings, rehypeAutolinkHeadingsOptions],
    ],
  },
  complete: async () => {
    await syncAssets()
  },
} satisfies UserConfig

export default defineConfig(config)
