import { modalAtom } from '@/atoms/header'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

export function useModalStatus() {
  const setIsModalOpen = useSetAtom(modalAtom)

  useEffect(() => {
    const checkModalStatus = () => {
      const clerkModal = document.querySelector('.cl-modalBackdrop')
      const dialogModal = document.querySelector('[data-slot="dialog-overlay"]')
      setIsModalOpen(!!(clerkModal || dialogModal))
    }

    checkModalStatus()

    const observer = new MutationObserver(checkModalStatus)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-slot'],
    })

    return () => observer.disconnect()
  }, [setIsModalOpen])
}
