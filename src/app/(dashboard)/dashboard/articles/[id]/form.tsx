'use client'

import { useArticlesData } from '@/atoms/dashboard/hooks/useArticle'
import { useCategoriesData } from '@/atoms/dashboard/hooks/useCategory'
import { useMilkdown } from '@/atoms/editor/useMilkdown'
import { MDXPreview } from '@/components/mdx/MDXPreview'
import { MilkdownEditorWrapper } from '@/components/mdx/milkdown/milkdown-wrapper'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { ChevronUp, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArticleTags } from './article-tags'

interface FormProps {
  id: number
}

export function ArticleForm({ id }: FormProps) {
  const router = useRouter()
  const { isLoading, error, updateArticle, articleMap } = useArticlesData()
  const { categoryIds, categoryMap } = useCategoriesData()

  const article = articleMap[id]
  const [selectedTags, setSelectedTags] = useState<number[]>(article?.tagIds || [])

  const [showMetadata, setShowMetadata] = useState(false)

  const { present } = useModalStack()
  const { milkdownContent, setMilkdownContent } = useMilkdown()

  const showArticleModal = useCallback(() => {
    const modalId = `article-${id}`
    present({
      id: modalId,
      title: `${article?.title || '文章'}`,
      content: () => (
        <MDXPreview
          markdown={milkdownContent}
        />
      ),
    })
  }, [present, milkdownContent, article?.title, id])
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      categoryId: 0,
      cover: '',
      published: false,
      mood: '',
      weather: '',
      location: '',
    },
  })

  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title || '',
        description: article.description || '',
        slug: article.slug || '',
        categoryId: article.categoryId || 0,
        cover: article.cover || '',
        published: article.published || false,
        mood: article.mood || '',
        weather: article.weather || '',
        location: article.location || '',
      })

      // 设置内容
      setMilkdownContent(article.content || '')

      // 设置标签
      if (article.tagIds && article.tagIds.length > 0) {
        setSelectedTags(article.tagIds)
      }
    }
  }, [article, form, setMilkdownContent])

  const handleSave = async (formData: any) => {
    const payload = {
      ...formData,
      content: milkdownContent,
      tagIds: selectedTags,
    }

    await updateArticle(id, payload)
  }

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (error) {
    return (
      <div>
        错误:
        {error.message}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 space-y-10">
      {/* 元数据表单 - 可折叠 */}
      {showMetadata && (
        <Card className="w-full shadow-md rounded-xl border border-border bg-card/80">
          <CardContent className="py-6 px-6">
            <Form {...form}>
              <div className="mb-6">
                <div className="text-lg font-semibold mb-4 text-primary">meta信息</div>
                <div className="flex flex-wrap gap-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">标题</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入文章标题" {...field} className="h-8 text-sm" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cover"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">封面图</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入封面图URL" {...field} className="h-8 text-sm" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">分类</FormLabel>
                        <Select
                          onValueChange={value => field.onChange(Number(value))}
                          value={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="选择分类" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryIds.map(id => (
                              <SelectItem key={id} value={String(id)}>
                                {categoryMap[id].name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel className="text-xs font-medium">发布状态</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {article?.type === 'NOTE' && (
                <div className="mb-6 border-t border-dashed border-border pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="mood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">心情</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入心情" {...field} className="h-8 text-sm" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weather"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">天气</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入天气" {...field} className="h-8 text-sm" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">地点</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入地点" {...field} className="h-8 text-sm" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              { article?.type !== 'NOTE' && (
                <div className="mb-3">
                  <FormLabel className="text-xs font-medium">标签</FormLabel>
                  <ArticleTags
                    selectedTagIds={selectedTags}
                    onChange={setSelectedTags}
                    className="mt-1"
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    已选择
                    {' '}
                    {selectedTags.length}
                    {' '}
                    个标签
                  </div>
                </div>
              )}
            </Form>
          </CardContent>
        </Card>
      )}
      <div className="flex items-center flex-wrap justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="h-8"
        >
          返回
        </Button>
        <Button size="sm" className="h-8" onClick={form.handleSubmit(handleSave)}>保存</Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMetadata(!showMetadata)}
          className="h-8"
        >
          <ChevronUp className={cn(
            'h-4 w-4 mr-1.5 transition-transform',
            showMetadata ? 'rotate-180' : '',
          )}
          />
          元数据
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={showArticleModal}
          className="h-8"
        >
          <Eye className="h-4 w-4 mr-1.5" />
          预览
        </Button>
      </div>
      <h1 className="text-3xl font-bold truncate text-center">
        {article?.title || '未命名'}
      </h1>
      <MilkdownEditorWrapper />
    </div>
  )
}
