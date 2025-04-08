import { ArticleForm } from './form'

export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idNumber = Number(id)
  return <ArticleForm id={idNumber} />
}
