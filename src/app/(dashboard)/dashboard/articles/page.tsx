'use client'

import type { Article } from '@/generated'
import { useArticlesData } from '@/atoms/dashboard/hooks/useArticle'
import { BaseDataTable } from '@/components/dashboard/table/base-data-table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useColumns } from './columns'

export interface DataTableRowAction<T> {
  type: 'edit' | 'delete'
  id: number
  updates?: Partial<T>
}

export default function ArticlesPage() {
  const router = useRouter()
  const [rowAction, setRowAction] = useState<DataTableRowAction<Article> | null>(null)

  const { isLoading, error, articleIds, articleMap, updateArticle, removeArticle } = useArticlesData()
  const columns = useColumns({ setRowAction })

  useEffect(() => {
    if (!rowAction)
      return
    if (rowAction.type === 'edit' && rowAction.updates) {
      updateArticle(rowAction.id, rowAction.updates)
    }
    if (rowAction.type === 'delete') {
      removeArticle(rowAction.id)
    }
  }, [rowAction, updateArticle, removeArticle])

  if (isLoading)
    return <div>Loading...</div>
  if (error) {
    return (
      <div>
        Error:
        {error.message}
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">文章管理</h2>
        <Button onClick={() => router.push('/dashboard/articles/new')} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          新增文章
        </Button>
      </div>
      <BaseDataTable
        columns={columns}
        data={articleIds.map(id => articleMap[id])}
        filterKey="title"
      />
    </>
  )
}
