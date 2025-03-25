'use client'

import { Button } from '@/components/ui/button'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'
import { TagContent } from './tag-content'

interface TagProps {
  name: string
}

export function Tag({ name }: TagProps) {
  const { present } = useModalStack()

  const showModal = useCallback(() => {
    present({
      title: `Tag: ${name}`,
      content: () => <TagContent name={name} />,
    })
  }, [present, name])

  return (
    <Button
      variant="link"
      className="p-1 text-md"
      onClick={showModal}
    >
      {name}
    </Button>
  )
}
