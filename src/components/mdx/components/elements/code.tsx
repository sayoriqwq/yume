import type { ReactNode } from 'react'

export function Code({ children, ...props }: { children: ReactNode | string }) {
  if (typeof children === 'string') {
    return <code {...props} dangerouslySetInnerHTML={{ __html: children }} />
  }
  else {
    return <code {...props}>{children}</code>
  }
}
