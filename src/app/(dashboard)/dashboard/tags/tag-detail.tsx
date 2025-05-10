'use client'

import { useArticlesData } from '@/atoms/dashboard/hooks/useArticle'
import { useTagsData } from '@/atoms/dashboard/hooks/useTag'
import { NormalTime } from '@/components/common/time'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Edit, Save, Search, X } from 'lucide-react'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback, useState } from 'react'

export function TagDetail({ id }: { id: number }) {
  const { tagMap, updateTag } = useTagsData()
  const { articleMap } = useArticlesData()
  const tag = tagMap[id]
  const articleIds = tag?.articleIds || []
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { articleIds: allArticleIds, articleMap: allArticleMap } = useArticlesData()
  const { present } = useModalStack()

  // 编辑中的文章ID列表
  const [editingArticleIds, setEditingArticleIds] = useState<number[]>(articleIds)

  // 获取可添加的文章（过滤掉已经选择的）
  const availableArticleIds = allArticleIds.filter(
    articleId => !editingArticleIds.includes(articleId),
  )

  // 搜索过滤
  const filteredArticleIds = availableArticleIds.filter(articleId =>
    allArticleMap[articleId]?.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // 开始编辑
  const handleStartEditing = () => {
    setEditingArticleIds([...articleIds])
    setIsEditing(true)
  }

  // 保存更改
  const handleSave = () => {
    updateTag(id, { articleIds: editingArticleIds })
    setIsEditing(false)
  }

  // 取消编辑
  const handleCancel = () => {
    setEditingArticleIds([...articleIds])
    setIsEditing(false)
  }

  // 从编辑中移除文章
  const removeArticle = (articleId: number) => {
    setEditingArticleIds(prevIds => prevIds.filter(id => id !== articleId))
  }

  // 添加文章到编辑列表
  const addArticle = (articleId: number) => {
    setEditingArticleIds(prevIds => [...prevIds, articleId])
  }

  // 查看文章预览
  const showArticlePreview = useCallback((articleId: number) => {
    const article = articleMap[articleId]
    const modalId = `article-${articleId}`
    present({
      id: modalId,
      title: article?.title || '文章预览',
      content: () => (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">{article?.title}</h2>
          <p className="text-muted-foreground mb-2">
            创建于：
            {new Date(article?.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-4 prose dark:prose-invert">
            {article?.description && <p>{article.description}</p>}
            <p className="text-muted-foreground">
              文章内容预览不可用。请到文章详情页查看完整内容。
            </p>
          </div>
        </div>
      ),
    })
  }, [articleMap, present])

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-end mb-4">
        {!isEditing
          ? (
              <Button variant="outline" onClick={handleStartEditing}>
                <Edit className="size-4" />
              </Button>
            )
          : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  取消
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              </div>
            )}
      </div>

      <div>
        {!isEditing
          ? (
              // 正常浏览模式 - 文章列表
              <div className="space-y-4">
                {articleIds.length === 0
                  ? (
                      <div className="text-center text-muted-foreground py-8">
                        此标签尚未关联任何文章
                      </div>
                    )
                  : (
                      articleIds.map(articleId => (
                        <div
                          key={articleId}
                          className="group flex items-center justify-between border-b pb-3 cursor-pointer"
                          onClick={() => showArticlePreview(articleId)}
                        >
                          <div className="flex-between w-64">
                            <h2 className="font-heading relative line-clamp-1 w-fit max-w-32 text-xl">
                              {articleMap[articleId]?.title}
                            </h2>
                            <NormalTime date={articleMap[articleId]?.createdAt} className="text-muted-foreground" />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              showArticlePreview(articleId)
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
              </div>
            )
          : (
        // 编辑模式 - 两列布局
              <div className="flex gap-4 w-[800px] h-[500px]">
                {/* 左侧 - 已选文章 */}
                <div className="w-1/2 border rounded-md p-3">
                  <h3 className="font-medium mb-3 flex items-center">
                    已选文章 (
                    {editingArticleIds.length}
                    )
                  </h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {editingArticleIds.length === 0
                      ? (
                          <div className="text-center text-muted-foreground py-4">
                            未选择任何文章
                          </div>
                        )
                      : (
                          editingArticleIds.map(articleId => (
                            <div
                              key={articleId}
                              className="group flex items-center justify-between border-b pb-2"
                            >
                              <div className="flex-1 truncate">
                                <p className="font-medium truncate">{allArticleMap[articleId]?.title}</p>
                                <NormalTime date={allArticleMap[articleId]?.createdAt} className="text-xs text-muted-foreground" />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeArticle(articleId)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                  </div>
                </div>

                {/* 右侧 - 可选文章 */}
                <div className="w-1/2 border rounded-md p-3">
                  <h3 className="font-medium mb-3">可选文章</h3>
                  <div className="mb-3 relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索文章..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {filteredArticleIds.length === 0
                      ? (
                          <div className="text-center text-muted-foreground py-4">
                            {searchQuery ? '没有找到匹配的文章' : '没有可添加的文章'}
                          </div>
                        )
                      : (
                          filteredArticleIds.map(articleId => (
                            <div
                              key={articleId}
                              className="group flex items-center justify-between border-b pb-2"
                            >
                              <div className="flex-1 truncate">
                                <p className="font-medium truncate">{allArticleMap[articleId]?.title}</p>
                                <NormalTime date={allArticleMap[articleId]?.createdAt} className="text-xs text-muted-foreground" />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary hover:text-primary hover:bg-primary/10"
                                onClick={() => addArticle(articleId)}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                  </div>
                </div>
              </div>
            )}
      </div>
    </div>
  )
}
