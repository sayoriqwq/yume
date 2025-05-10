import type { FriendLink } from '@/generated'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'

interface FriendCardProps {
  friend: FriendLink
}

export function FriendCard({ friend }: FriendCardProps) {
  return (
    <div className="flex items-center gap-8 p-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={friend.link} target="_blank">
              <Avatar className="size-24 ring ring-muted hover:ring-2 hover:ring-ring transition-all duration-300">
                <AvatarImage
                  src={friend.avatar}
                  alt="友链图片加载失败"
                  width={100}
                  height={100}
                />
                <AvatarFallback>{friend.nickname}</AvatarFallback>
              </Avatar>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={-25}>
            前往
            {' '}
            <Link className="text-primary" href={friend.link} target="_blank">{friend.siteName}</Link>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex flex-col">
        <span className="text-foreground text-lg">{friend.nickname}</span>
        <span className="text-md text-muted-foreground text-wrap">
          {friend.description}
        </span>
      </div>
    </div>
  )
}
