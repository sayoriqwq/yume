'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback, useState } from 'react'

interface DataTableCellWithEditProps {
  modal?: {
    fieldName: string
  }
  customValueWrapper?: (value: string) => React.ReactNode
  onSave: (value: any) => void
  getValue: () => string
}
interface EditModalContentProps {
  initialValue: string
  onSave: (value: string) => void
  modalId: string
}
function EditModalContent({ initialValue, onSave, modalId }: EditModalContentProps) {
  const [modalValue, setModalValue] = useState(initialValue)
  const { dismiss } = useModalStack()

  return (
    <div className="flex gap-4 max-w-[300px]">
      <Textarea
        id={modalId}
        value={modalValue}
        onChange={e => setModalValue(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <Button
        onClick={() => {
          onSave(modalValue)
          dismiss(modalId)
        }}
      >
        保存
      </Button>
    </div>
  )
}

export function DataTableCellWithEdit({
  getValue,
  onSave,
  customValueWrapper,
  modal,
}: DataTableCellWithEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(getValue())

  const { present } = useModalStack()

  const showEditModal = useCallback(() => {
    if (!modal)
      return
    const { fieldName } = modal
    const modalId = `edit-${fieldName}`
    present({
      id: modalId,
      title: `编辑${fieldName}`,
      content: () => (
        <EditModalContent
          initialValue={getValue()}
          onSave={onSave}
          modalId={modalId}
        />
      ),
    })
  }, [present, modal, getValue, onSave])

  return isEditing
    ? (
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
            onBlur={() => {
              setIsEditing(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditing(false)
                onSave(value)
              }
              if (e.key === 'Escape') {
                setIsEditing(false)
                setValue(getValue())
              }
            }}
          />
        </div>
      )
    : (
        <div
          className="cursor-pointer hover:bg-muted/50 p-2 rounded"
          onDoubleClick={() => modal ? showEditModal() : setIsEditing(true)}
        >
          {customValueWrapper ? customValueWrapper(getValue()) : getValue()}
        </div>
      )
}
