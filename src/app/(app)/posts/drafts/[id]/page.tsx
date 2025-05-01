'use client'

import type { Draft } from '@/types/article/article'
import { Loading } from '@/components/common/loading'
import { NormalTime } from '@/components/common/time'
import { ClientMDX } from '@/components/mdx/client-mdx'
import { NormalContainer } from '@/layout/container/Normal'
import { formatArticle } from '@/types/article/format'
import { notFound, useParams } from 'next/navigation'
import useSWR from 'swr'

export default function DraftPage() {
  const params = useParams()
  const id = params?.id as string

  const { data, error, isLoading } = useSWR(
    `/api/articles/${id}?type=DRAFT`,
  )

  // 格式化草稿数据
  const draft = data ? formatArticle<Draft>(data) : undefined

  if (error)
    return notFound()
  if (!draft)
    return notFound()

  return (
    <NormalContainer className="pt-32">
      <div className="border border-dashed border-muted-foreground/20 rounded-lg p-6 bg-muted/10">
        {isLoading
          ? (
              <Loading />
            )
          : (
              <>
                <h1 className="text-3xl font-bold mb-2">{draft?.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground mb-8">
                  <NormalTime date={draft?.createdAt} />
                  {draft?.category && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{draft?.category}</span>
                    </>
                  )}
                  <span className="mx-2">•</span>
                  <span>草稿</span>
                </div>

                <ClientMDX
                  markdown={draft.content || ''}
                  className="prose dark:prose-invert prose-sm max-w-none"
                />
              </>
            )}
      </div>
    </NormalContainer>
  )
}
