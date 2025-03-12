import { FRIENDS } from '@/constants/friends'
import { FriendCard } from './friend-card'

export function FriendList() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-2xl font-bold">
        朋友们
      </p>
      <div className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 px-4">
        {
          FRIENDS.map(friend => (
            <FriendCard key={friend.link} friend={friend} />
          ))
        }
      </div>
    </div>
  )
}
