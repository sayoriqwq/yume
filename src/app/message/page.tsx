import { getMessages } from './components/actions'
import MessageContainer from './components/container'

export default function Page() {
  const messagePromise = getMessages()

  return (
    <MessageContainer messagesPromise={messagePromise} />
  )
}
