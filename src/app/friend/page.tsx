import { ApplyFriendLink } from '@/components/module/friend/apply-friend-link'
import { FriendList } from '@/components/module/friend/friend-list'
import { getFriends } from '@/data/friends'

export default async function Page() {
  const friends = getFriends()
  return (
    <div className="mt-10 flex flex-col gap-10">
      <FriendList friends={friends} />
      <ApplyFriendLink />
    </div>

  )
}
