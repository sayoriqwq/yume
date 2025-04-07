import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useOverflowText } from '@/hooks/useOverflowText'
import isUndefined from 'lodash-es/isUndefined'

interface DataTableCellWithTooltipProps {
  text: string | undefined
}

export function DataTableCellWithTooltip({ text }: DataTableCellWithTooltipProps) {
  if (isUndefined(text)) {
    text = '神秘'
  }
  const [textRef, needTooltip] = useOverflowText([text])
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-[200px] text-wrap line-clamp-2 text-sm" ref={textRef}>
            {text}
          </div>
        </TooltipTrigger>
        {needTooltip && (
          <TooltipContent className="max-w-xs">
            <p>{text}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
