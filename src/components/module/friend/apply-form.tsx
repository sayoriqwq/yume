'use client'

import type { FriendLinkFormValues } from './schema'

import { useState } from 'react'

import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { submitFriendLinkAction } from './action'
import { friendLinkFormResolver } from './schema'

export function ApplyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<FriendLinkFormValues>({
    resolver: friendLinkFormResolver,
    defaultValues: {
      nickname: '',
      siteName: '',
      avatar: '',
      link: '',
      description: '',
    },
  })

  async function onSubmit(values: FriendLinkFormValues) {
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
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="nickname">昵称</FieldLabel>
              <FieldContent>
                <Input
                  id="nickname"
                  placeholder="昵称"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </FieldContent>
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name="siteName"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="siteName">网站名称</FieldLabel>
              <FieldContent>
                <Input
                  id="siteName"
                  placeholder="你的网站名称"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </FieldContent>
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="avatar">头像链接</FieldLabel>
              <FieldContent>
                <Input
                  id="avatar"
                  type="url"
                  placeholder="你的头像链接"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </FieldContent>
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="link">网站链接</FieldLabel>
              <FieldContent>
                <Input
                  id="link"
                  type="url"
                  placeholder="你的网站地址"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </FieldContent>
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="description">描述</FieldLabel>
              <FieldContent>
                <Textarea
                  id="description"
                  placeholder="一些关于你的额外信息"
                  className="resize-none"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </FieldContent>
            </Field>
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
