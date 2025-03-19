'use client'

import type { Blog } from '@/components/dashboard/articles/blog/columns'
import { columns } from '@/components/dashboard/articles/blog/columns'
import { BaseDataTable } from '@/components/dashboard/table/base-data-table'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DemoPage() {
  const { data, error, isLoading } = useSWR<Blog[]>('/api/articles', fetcher)

  if (error)
    return <div className="container mx-auto py-10">加载失败...</div>
  if (isLoading)
    return <div className="container mx-auto py-10">加载中...</div>

  return (
    <div className="container mx-auto py-10">
      <BaseDataTable columns={columns} data={data ?? []} />
    </div>
  )
}
