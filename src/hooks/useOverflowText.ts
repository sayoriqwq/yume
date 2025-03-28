import { useLayoutEffect, useRef, useState } from 'react'

/**
 * 检测文本元素是否溢出/被截断的 hook
 * @param deps 依赖数组，当这些依赖变化时重新检测溢出状态
 * @returns [ref, isOverflowing] - ref 需要附加到文本元素上，isOverflowing 表示文本是否溢出
 */
export function useOverflowText(deps: React.DependencyList = []): [React.RefObject<HTMLDivElement>, boolean] {
  const textRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const [isOverflowing, setIsOverflowing] = useState(false)

  useLayoutEffect(() => {
    const element = textRef.current
    if (element) {
      // 检测元素是否有溢出
      setIsOverflowing(element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
    }
  }, deps)

  return [textRef, isOverflowing]
}
