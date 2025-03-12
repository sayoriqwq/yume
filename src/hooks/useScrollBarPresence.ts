import { useEffect, useState } from 'react'

/**
 * 监视页面滚动条的出现和消失
 * @returns 当前滚动条宽度
 */
export function useScrollbarPresence() {
  const [scrollbarWidth, setScrollbarWidth] = useState(0)
  const [hasScrollbar, setHasScrollbar] = useState(false)

  useEffect(() => {
    // 计算滚动条宽度
    const calculateScrollbarWidth = () => {
      const htmlElement = document.documentElement
      const hasCustomScrollbar
          = htmlElement.className.includes('scrollbar-thin')
            || htmlElement.className.includes('scrollbar-')

      // 如果有自定义滚动条，使用对应的宽度
      if (hasCustomScrollbar) {
        if (htmlElement.className.includes('scrollbar-thin')) {
          return 11
        }
      }
      // 原生比较
      const outer = document.createElement('div')
      outer.style.visibility = 'hidden'
      outer.style.overflow = 'scroll'
      document.body.appendChild(outer)

      const inner = document.createElement('div')
      outer.appendChild(inner)

      const width = outer.offsetWidth - inner.offsetWidth
      document.body.removeChild(outer)
      return width
    }

    // 检测页面是否有滚动条
    const checkScrollbar = () => {
      const hasVerticalScrollbar = window.innerWidth > document.documentElement.clientWidth
      setHasScrollbar(hasVerticalScrollbar)
    }

    // 初始化滚动条宽度
    const width = calculateScrollbarWidth()
    setScrollbarWidth(width)

    // 初始检查
    checkScrollbar()

    // 监听滚动条状态变化
    const observer = new MutationObserver(() => {
      checkScrollbar()
    })

    // 监听body的变化，因为模态框会修改body的overflow
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    // 监听窗口大小变化
    window.addEventListener('resize', checkScrollbar)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', checkScrollbar)
    }
  }, [])

  return { scrollbarWidth, hasScrollbar }
}
