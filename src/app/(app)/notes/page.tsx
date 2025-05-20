import { getArticles } from '@/db/article/service'
import { redirect } from 'next/navigation'

export default async function NotesPage() {
  const { articles } = await getArticles({
    type: 'NOTE',
    limit: 1,
    page: 1,
    published: true,
  })

  if (articles && articles.length > 0) {
    redirect(`/notes/${articles[0].id}`)
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">暂无随笔</h1>
      <p>目前还没有发布任何随笔。</p>
    </div>
  )
}
