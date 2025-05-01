import { EyeIcon } from 'lucide-react'

export function ViewCount({ count }: { count: number }) {
  return (
    <span className="flex-center gap-1">
      <EyeIcon className="size-3" />
      {' '}
      {count.toString()}
    </span>
  )
}
