import { ViewCountRecord } from '@/components/module/article/view-count-record'
import { NoteContainer } from '@/components/module/note/note-container'
import { getArticleById } from '@/db/article/service'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const idNumber = Number(idStr)
  const note = await getArticleById(idNumber)
  if (!note) {
    notFound()
  }
  return (
    <>
      <ViewCountRecord articleId={note.id} />
      <NoteContainer article={note} />
    </>
  )
}
