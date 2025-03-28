'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { atom, useAtom } from 'jotai'
import { Button } from '../ui/button'

interface CommandDialogState {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void | Promise<void>
  confirmText?: string
  cancelText?: string
}

const commandDialogAtom = atom<CommandDialogState>({
  isOpen: false,
  title: '',
  description: '',
  onConfirm: () => {},
  confirmText: '确认',
  cancelText: '取消',
})

export function useCommandDialog() {
  const [state, setState] = useAtom(commandDialogAtom)

  const open = ({
    title,
    description,
    onConfirm,
    confirmText = '确认',
    cancelText = '取消',
  }: Omit<CommandDialogState, 'isOpen'>) => {
    setState({
      isOpen: true,
      title,
      description,
      onConfirm,
      confirmText,
      cancelText,
    })
  }

  const close = () => {
    setState({
      isOpen: false,
      title: '',
      description: '',
      onConfirm: () => {},
      confirmText: '确认',
      cancelText: '取消',
    })
  }

  return {
    ...state,
    open,
    close,
  }
}

export function CommandDialog() {
  const { isOpen, title, description, onConfirm, confirmText, cancelText, close } = useCommandDialog()

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
