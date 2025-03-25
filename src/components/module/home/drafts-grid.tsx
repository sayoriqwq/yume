import { NormalContainer } from '@/layout/container/Normal'
import { Drafts } from './drafts'
import { RecentActivity } from './recent-activity'

export function DraftsGrid() {
  return (
    <NormalContainer>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <Drafts />
        <RecentActivity />
      </div>
    </NormalContainer>
  )
}
