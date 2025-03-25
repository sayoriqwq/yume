import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TagProps {
  name: string
  count?: number
  current?: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function TagBadge({ name, current, count, size = 'sm', onClick }: TagProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'cursor-pointer transition-all duration-300 group relative',
        'hover:bg-primary/20 hover:text-primary-foreground hover:shadow-sm',
        'flex items-center justify-center',
        current && 'bg-primary/30 text-primary-foreground',
        size === 'sm' && 'text-xs px-3 py-1',
        size === 'md' && 'text-sm px-4 py-1.5',
        size === 'lg' && 'text-base px-5 py-2 font-medium',
      )}
      onClick={onClick}
    >
      <span className="group-hover:scale-105 transition-transform duration-200">{name}</span>
      {count !== undefined && (
        <span className="ml-1.5 text-muted-foreground text-xs opacity-70 group-hover:opacity-100 transition-opacity">
          (
          {count}
          )
        </span>
      )}
    </Badge>
  )
}
