'use client'

import type * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createFriendLinkSchema } from '@/db/site/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { submitFriendLinkAction } from './action'

export function ApplyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof createFriendLinkSchema>>({
    resolver: zodResolver(createFriendLinkSchema),
    defaultValues: {
      nickname: '',
      siteName: '',
      avatar: '',
      link: '',
      description: '',
    },
  })

  async function onSubmit(values: z.infer<typeof createFriendLinkSchema>) {
    try {
      setIsSubmitting(true)

      const result = await submitFriendLinkAction(values)

      if (result.success) {
        toast.success('友链申请提交成功，我会尽快回复！')
        form.reset()
      }
      else {
        toast.error(result.error || '提交失败，请稍后重试')
      }
    }
    catch (error) {
      console.error('申请提交出错:', error)
      toast.error('提交时发生错误，请稍后再试')
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>昵称</FormLabel>
              <FormControl>
                <Input placeholder="昵称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="siteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>网站名称</FormLabel>
              <FormControl>
                <Input placeholder="你的网站名称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>头像链接</FormLabel>
              <FormControl>
                <Input type="url" placeholder="你的头像链接" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>网站链接</FormLabel>
              <FormControl>
                <Input type="url" placeholder="你的网站地址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="一些关于你的额外信息"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            重置
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '提交申请'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
