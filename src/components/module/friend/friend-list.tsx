import { friends } from '@/constants/friends'
import { FriendCard } from './friend-card'

export function FriendList() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-2xl font-bold">
        朋友们
      </p>
      <div className="grid grid-cols-1 gap-x-4 gap-y-10 px-20 md:grid-cols-2">
        {
          friends.map(friend => (
            <FriendCard key={friend.id} friend={friend} />
          ))
        }
      </div>
    </div>
  )
}
