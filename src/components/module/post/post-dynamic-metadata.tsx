import type { IPostMetaData } from '@/types/post'
import { Category } from '../category/category'
import { Tag } from '../tag/tag'

interface PostDynamicMetadataProps {
  metadata: IPostMetaData
}

export function PostDynamicMetadata({ metadata }: PostDynamicMetadataProps) {
  return (
    <span>
      <Category name={metadata.category} />
      {metadata.tags?.map(tag => (
        <Tag key={tag} name={tag} />
      ))}
    </span>
  )
}
