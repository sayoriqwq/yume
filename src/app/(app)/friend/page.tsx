import { ApplyFriendLink } from '@/components/module/friend/apply-friend-link'
import { FriendList } from '@/components/module/friend/friend-list'

// 模拟获取朋友列表的函数
async function getFriendData() {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 3000))

  // 这里可以是您实际的数据获取逻辑
  return {}
}

export default async function Page() {
  const _data = await getFriendData()
  return (
    <div className="mt-10 flex flex-col gap-10">
      <FriendList />
      <ApplyFriendLink />
    </div>

  )
}
