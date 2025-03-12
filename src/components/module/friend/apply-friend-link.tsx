import { ApplyForm } from './apply-form'
import { SiteInfo } from './site-info'

export function ApplyFriendLink() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-2xl font-bold">
        和我交朋友吧！
      </p>
      <div className="flex flex-col gap-4 px-4">
        <ApplyForm />
        <SiteInfo />
      </div>
    </div>
  )
}
