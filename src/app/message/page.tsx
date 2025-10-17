import { Loading } from '@/components/common/loading'
import { getMessages } from '@/components/module/message/actions'
import MessageContainer from '@/components/module/message/container'
import { Suspense } from 'react'

export default function Page() {
  const messagePromise = getMessages()

  return (
    <Suspense fallback={<Loading />}>
      <MessageContainer messagesPromise={messagePromise} />
    </Suspense>
  )
}
