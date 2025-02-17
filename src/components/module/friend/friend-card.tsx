import type { Friend } from '@/types/friend'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

interface FriendCardProps {
  friend: Friend
}

export function FriendCard({ friend }: FriendCardProps) {
  return (
    <div className="flex items-center gap-8 p-4">
      <Link href={friend.link} target="_blank">
        <Avatar className="size-24 ring ring-muted hover:ring-2 hover:ring-ring transition-all duration-300">
          <AvatarImage
            src={friend.avatar}
            alt="友链图片加载失败"
            width={100}
            height={100}
          />
          <AvatarFallback>{friend.name}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex flex-col">
        <span className="text-foreground text-lg">{friend.name}</span>
        <span className="text-md text-muted-foreground text-wrap">
          {friend.description}
        </span>
      </div>
    </div>
  )
}
