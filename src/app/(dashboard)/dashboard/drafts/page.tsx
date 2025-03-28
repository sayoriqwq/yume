'use client'

import type { Draft } from '@/types/article'
import { useArticlesData } from '@/atoms/dashboard/hooks/useArticle'
import { BaseDataTable } from '@/components/dashboard/table/base-data-table'
import { getColumns } from './columns'

export default function ArticlesPage() {
  const { isLoading, error, articleIds, articleMap, updateArticle, removeArticle } = useArticlesData('DRAFT')

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

  const actions = {
    onDelete: (id: number) => {
      removeArticle(id)
    },
    onEdit: (row: Draft) => {
      updateArticle(row.id, row)
    },
  }

  const columns = getColumns(actions)

  return (
    <>
      <BaseDataTable
        columns={columns}
        data={articleIds.map(id => articleMap[id]) as any[]}
        filterKey="title"
      />
    </>
  )
}
