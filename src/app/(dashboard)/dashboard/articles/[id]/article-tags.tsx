'use client'

import { useTagsData } from '@/atoms/dashboard/hooks/useTag'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface ArticleTagsProps {
  selectedTagIds: number[]
  onChange: (tagIds: number[]) => void
  className?: string
  isModal?: boolean
  onSave?: () => void
  onClose?: () => void
}

export function ArticleTags({
  selectedTagIds,
  onChange,
  className,
  isModal = false,
  onSave,
  onClose,
}: ArticleTagsProps) {
  const { tagIds: AllTagIds, tagMap, isLoading, error } = useTagsData()

  if (isLoading)
    return <div>加载中...</div>
  if (error) {
    return (
      <div>
        错误:
        {error.message}
      </div>
    )
  }

  function handleTagSelect(tagId: number) {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter(id => id !== tagId))
    }
    else {
      onChange([...selectedTagIds, tagId])
    }
  }

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <ScrollArea className={cn('h-full', isModal ? 'max-h-[300px]' : '')}>
        <div className="flex flex-wrap gap-2 p-2">
          {AllTagIds.map(id => (
            <Badge
              key={id}
              variant={selectedTagIds.includes(id) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer text-sm px-3 py-1 transition-all',
                selectedTagIds.includes(id) ? 'hover:bg-primary/80' : 'hover:bg-secondary',
              )}
              onClick={() => handleTagSelect(id)}
            >
              {tagMap[id]?.name}
            </Badge>
          ))}
        </div>
      </ScrollArea>

      {isModal && (
        <div className="flex justify-end gap-2 pt-2">
          {onClose && <Button variant="outline" size="sm" onClick={onClose}>取消</Button>}
          {onSave && <Button size="sm" onClick={onSave}>保存</Button>}
        </div>
      )}
    </div>
  )
}
