import { Writer } from './Writer'

export default async function DraftEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idNumber = Number(id)
  return <Writer id={idNumber} />
}
