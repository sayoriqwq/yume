import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

export const isComposingAtom = atom<boolean>(false)
export const meiliSearchModalAtom = atom<boolean>(false)

export function useSearchHotkeys() {
  const [open, setOpen] = useAtom(meiliSearchModalAtom)
  const [isComposing] = useAtom(isComposingAtom)
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setOpen(!open)
      }

      if (
        event.key === 'Escape'
        && open
        && !isComposing
      ) {
        event.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [open, setOpen, isComposing])
}
