import { NormalTime, RelativeTime } from '@/components/common/time'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ClockIcon } from 'lucide-react'

interface EditedTimeProps {
  createdAt: Date | string
  updatedAt: Date | string
  className?: string
}

export function EditedTime({ createdAt, updatedAt, className }: EditedTimeProps) {
  // 检查创建时间和更新时间是否相同
  const isEdited = new Date(createdAt).getTime() !== new Date(updatedAt).getTime()

  return (
    <div className="flex items-center gap-1.5">
      <ClockIcon className="size-4 text-muted-foreground" />

      {isEdited
        ? (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <RelativeTime date={updatedAt} className={className} />
                    <span className="text-muted-foreground text-xs">(已编辑)</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>
                    创建于：
                    <NormalTime date={createdAt} />
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        : (
            <RelativeTime date={updatedAt} className={className} />
          )}
    </div>
  )
}
