import { HeartIcon } from 'lucide-react'

export function LikeCount({ count }: { count: number }) {
  return (
    <span className="flex-center gap-1">
      <HeartIcon className="size-3" />
      {' '}
      {count.toString()}
    </span>
  )
}
