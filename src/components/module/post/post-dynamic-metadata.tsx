'use client'

import type { IPostMetaData } from '@/types/article/post'
import { Category } from '@/components/module/category/category'
import { Tag } from '@/components/module/tag/tag'

interface PostDynamicMetadataProps {
  metadata: IPostMetaData
}

export function PostDynamicMetadata({ metadata }: PostDynamicMetadataProps) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      {metadata.category && (
        <span className="flex gap-1 items-center">
          <Category name={metadata.category} />
        </span>
      )}
      {metadata.tags && metadata.tags.length > 0 && (
        <span className="flex gap-1 items-center">
          {metadata.tags.map(tag => (
            <Tag key={tag} name={tag} />
          ))}
        </span>
      )}
    </span>
  )
}
