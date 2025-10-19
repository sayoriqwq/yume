import { getAllPosts } from '@/data/post'
import { getAllTags } from '@/data/tag'
import { FilterablePostGrid } from './components/filterable-post-grid'

export default function Blog() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <header className="space-y-4">
        <h2 className="text-3xl font-aboreto">BLOG ARCHIVE</h2>
      </header>

      <FilterablePostGrid posts={posts} tags={tags} />
    </main>
  )
}
