import type { FriendLink } from '@/generated'
import { FriendCard } from './friend-card'

interface FriendListProps {
  friends: FriendLink[]
}

export function FriendList({ friends }: FriendListProps) {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-2xl font-bold">
        朋友们
      </p>
      <div className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 px-4">
        {
          friends.map(friend => (
            <FriendCard key={friend.link} friend={friend} />
          ))
        }
      </div>
    </div>
  )
}
