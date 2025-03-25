import { useState } from 'react'

export function useZIndex(initialIndex: number) {
  const [zIndex, setZIndex] = useState(initialIndex)

  const updateZIndex = () => {
    const els = document.querySelectorAll('.drag-elements')

    let maxZIndex = 999

    els.forEach((el) => {
      const zIndex = Number.parseInt(
        window.getComputedStyle(el).getPropertyValue('z-index'),
      )

      if (!Number.isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex
      }
    })

    setZIndex(maxZIndex + 1)
  }

  const resetZIndex = () => {
    setZIndex(initialIndex)
  }

  return [zIndex, updateZIndex, resetZIndex] as const
}
