'use client'

import { Button } from '@/components/ui/button'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'

interface TagProps {
  name: string
}

function useModal(name: string) {
  const { present } = useModalStack()

  return useCallback(() => {
    // 打开modal时直接展示一个加载中的状态
    present({
      title: `标签: ${name}`,
      content: () => {
        return (
          <div className="min-h-[200px] w-full flex justify-center items-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )
      },
    })
  }, [present, name])
}

export function Tag({ name }: TagProps) {
  const showModal = useModal(name)
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
