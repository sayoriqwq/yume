'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
  nickname: z.string().min(1, '昵称不能为空'),
  siteName: z.string().min(1, '网站名称不能为空'),
  avatar: z.string().url('请输入有效的URL'),
  link: z.string().url('请输入有效的URL'),
  description: z.string().min(1, '网站描述不能为空'),
})

export function ApplyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: '',
      siteName: '',
      avatar: '',
      link: '',
      description: '',
    },
  })

  function onSubmit(_values: z.infer<typeof formSchema>) {
    toast({
      title: '提交成功',
      description: '你的友链申请已提交',
    })
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
              <FormLabel>网站描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="简单介绍一下你的网站吧"
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
          <Button type="submit">
            提交申请
          </Button>
        </div>
      </form>
    </Form>
  )
}
