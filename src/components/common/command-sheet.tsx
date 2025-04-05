'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { atom, useAtom } from 'jotai'

// TODO: 用context做keepalive
interface CommandSheetState {
  isOpen: boolean
  title: string
  content: React.ReactNode | null
}

const commandSheetAtom = atom<CommandSheetState>({
  isOpen: false,
  title: '',
  content: null,
})

export function useCommandSheet() {
  const [state, setState] = useAtom(commandSheetAtom)

  const open = ({ title, content }: { title: string, content: React.ReactNode }) => {
    setState({ isOpen: true, title, content })
  }

  const close = () => {
    setState({ isOpen: false, title: '', content: null })
  }

  return {
    ...state,
    open,
    close,
  }
}

export function CommandSheet() {
  const { isOpen, title, content, close } = useCommandSheet()

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  )
}
