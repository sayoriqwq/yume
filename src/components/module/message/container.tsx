'use client'

import type { Message, MessageState, OptimisticMessage } from './type'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MESSAGE_FAKE_ARTICLE_ID } from '@/constants/defaults'
import { useUser } from '@clerk/nextjs'
import { use, useOptimistic, useRef, useTransition } from 'react'
import toast from 'react-hot-toast'
import { createMessage, deleteMessage } from './actions'
import { MessageItem } from './item'

export default function MessageContainer({ messagesPromise }: { messagesPromise: Promise<Message[]> }) {
  // 获取初始消息
  const initialMessages = use(messagesPromise)
  const { user } = useUser()
  const formRef = useRef<HTMLFormElement>(null)

  // 消息状态
  const [optimisticMessages, setOptimisticMessages] = useOptimistic<Message[]>(initialMessages)
  const [isPending, startTransition] = useTransition()

  function optimisticAction(id: number, type: 'create' | 'delete', newMessage?: string) {
    function rollback(id: number, type: 'create' | 'delete', optimisticMessage?: OptimisticMessage) {
      switch (type) {
        case 'create':
          setOptimisticMessages(prevMessages => prevMessages.filter(msg => msg.id !== id))
          break
        case 'delete':
          if (!optimisticMessage)
            return
          setOptimisticMessages(prevMessages => [optimisticMessage, ...prevMessages])
          break
        default:
          break
      }
    }

    const noop = () => {}
    if (type === 'create') {
      if (!user || !newMessage) {
        return {
          rollback: noop,
        }
      }

      const tempId = Math.random()
      const optimisticMessage: OptimisticMessage = {
        id: tempId,
        content: newMessage,
        authorId: user.id,
        articleId: MESSAGE_FAKE_ARTICLE_ID,
        parentId: null,
        status: 'APPROVED',
        isSending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: user.id,
          username: user.username!,
          email: user.emailAddresses[0].emailAddress,
          image_url: user.imageUrl,
        },
      }
      setOptimisticMessages(prevMessages => [optimisticMessage, ...prevMessages])
      return {
        rollback: () => rollback(tempId, 'create', optimisticMessage),
      }
    }
    else if (type === 'delete') {
      startTransition(() => {
        setOptimisticMessages(prevMessages => prevMessages.filter(msg => msg.id !== id))
      })
      return {
        rollback: () => rollback(id, 'delete'),
      }
    }
    return {
      rollback: noop,
    }
  }

  function formAction(formData: FormData) {
    const newMessage = formData.get('message') as string
    if (!newMessage || !user)
      return

    const { rollback } = optimisticAction(Math.random(), 'create', newMessage)

    formRef.current?.reset()

    startTransition(async () => {
      const result = await createMessage(formData)
      handleResult(result, rollback)
    })
  }
  const handleDelete = (id: number) => {
    const { rollback } = optimisticAction(id, 'delete')
    startTransition(async () => {
      const result = await deleteMessage(id)
      handleResult(result, rollback)
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        form.requestSubmit()
      }
    }
  }

  function handleResult(result: MessageState, rollback: () => void) {
    toast[result.success ? 'success' : 'error'](result.message)
    if (!result.success) {
      rollback()
    }
  }

  return (
    <div className="space-y-10 mt-10">
      {user
        ? (
            <form action={formAction} ref={formRef}>
              <div className="flex gap-5">
                <Textarea
                  name="message"
                  placeholder="有什么想说的呢？( cmd + Enter 发送 )"
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                  className="field-sizing-content max-h-96 min-h-[none] resize-none rounded-xl pr-10"
                />
                <Button
                  disabled={isPending}
                  type="submit"
                  className=""
                >
                  <span className="i-mingcute-send-line size-6" />
                </Button>
              </div>
            </form>
          )
        : (
            <div className="flex-center p-6 rounded-xl border border-dashed bg-card">
              <p className="text-card-foreground">登录后发送留言</p>
            </div>
          )}
      <ul className="flex flex-col space-y-4">
        {optimisticMessages.map(message => (
          <MessageItem key={message.id} message={message} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  )
}
