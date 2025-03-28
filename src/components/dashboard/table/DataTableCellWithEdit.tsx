import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback } from 'react'

interface DataTableCellWithEditProps {
  fieldName: string
  initialValue: string
  id: number | string
  onSave: (id: number, field: { [key: string]: string }) => void
}

export function DataTableCellWithEdit({
  fieldName,
  initialValue,
  id,
  onSave,
}: DataTableCellWithEditProps) {
  const { present, dismiss } = useModalStack()
  // 显示编辑modal的方法
  const showEditModal = useCallback(() => {
    present({
      id: `edit-${fieldName}`,
      title: `编辑${fieldName}`,
      content: () => {
        return (
          <div className="flex gap-4">
            <Input
              type="text"
              id={fieldName}
              defaultValue={initialValue}
              className="w-full p-2 border rounded-md"
            />
            <Button
              onClick={() => {
                const element = document.getElementById(fieldName) as HTMLTextAreaElement
                onSave(id, { [fieldName]: element.value })
                dismiss(`edit-${fieldName}`)
              }}
            >
              保存
            </Button>
          </div>
        )
      },
    })
  }, [present, fieldName, initialValue, onSave])

  return (
    <div
      className="cursor-pointer hover:text-primary"
      onDoubleClick={showEditModal}
    >
      {initialValue}
    </div>
  )
}
