/* thanks for https://github.com/rehype-pretty/rehype-pretty-code/issues/235 */

'use client'

import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Check, Clipboard } from 'lucide-react'
import {

  useRef,
  useState,
} from 'react'

export default function Pre({
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleClickCopy = async () => {
    const code = preRef.current?.textContent

    if (code) {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }
  }

  return (
    <pre ref={preRef} {...props} className="relative group">
      <button
        disabled={isCopied}
        onClick={handleClickCopy}
        className={cn('absolute right-4 size-6 cursor-pointer text-muted-foreground', 'group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out')}
      >
        {isCopied ? <Check /> : <Clipboard />}
      </button>
      {children}
    </pre>
  )
}
