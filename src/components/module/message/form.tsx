'use client'

import type { Message } from '@prisma/client'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import { useActionState, useState } from 'react'
import toast from 'react-hot-toast'
import { createMessage } from './actions'

interface Props {
  setOptimisticMessages: (updateFn: (messages: Message[]) => Message[]) => void
}

export function MessageForm({ setOptimisticMessages }: Props) {
  const [message, setMessage] = useState('')
  const [state, formAction, isPending] = useActionState(createMessage, {
    message: '',
    success: false,
  })
  const { user } = useUser()

  if (!user) {
    return (
      <div className="flex-center p-6 rounded-xl border border-dashed bg-card">
        <p className="text-card-foreground">登录后发送留言</p>
      </div>
    )
  }

  const handleSubmit = async (formData: FormData) => {
    const newMessage = formData.get('message') as string
    if (!newMessage)
      return

    const optimisticMessage: Message & { isSending?: boolean } = {
      message: newMessage,
      userId: user.id,
      userName: (user.username || user.firstName) ?? '神秘',
      userImg: user.imageUrl,
      createdAt: new Date(),
      // fake id
      id: Math.random(),
      isSending: true,
    }

    setOptimisticMessages(prevMessages => [optimisticMessage, ...prevMessages])

    setMessage('')

    await formAction(formData)
    if (state.message) {
      toast[state.success ? 'success' : 'error'](state.message)
    }
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

  return (
    <form action={handleSubmit}>
      <div className="relative">
        <Textarea
          name="message"
          placeholder="有什么想说的呢？( cmd + Enter 发送 )"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          className="field-sizing-content max-h-96 min-h-[none] resize-none rounded-xl pr-10"
        />
        <button
          disabled={isPending}
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 flex-center"
        >
          <span className="i-mingcute-send-line size-6 text-muted-foreground cursor-pointer hover:text-accent hover:scale-105 transition-all duration-300" />
        </button>
      </div>
    </form>
  )
}
