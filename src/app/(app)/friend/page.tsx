import { ApplyFriendLink } from '@/components/module/friend/apply-friend-link'
import { FriendList } from '@/components/module/friend/friend-list'
import { getFriendLinks } from '@/db/site/service'

export default async function Page() {
  const friends = await getFriendLinks()
  return (
    <div className="mt-10 flex flex-col gap-10">
      <FriendList friends={friends} />
      <ApplyFriendLink />
    </div>

  )
}
