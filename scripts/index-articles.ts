import process from 'process'
import { getArticles } from '@/db/article/service'
import { MeiliSearch } from 'meilisearch'

// Meilisearch配置
const MEILISEARCH_HOST = 'http://localhost:7700'
const MEILISEARCH_API_KEY = 'aSampleMasterKey'
const INDEX_NAME = 'articles'

// 主函数
async function indexArticles() {
  console.log('开始索引文章...')

  // 初始化Meilisearch客户端
  const client = new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_API_KEY,
  })

  try {
    // 准备索引
    try {
      await client.getIndex(INDEX_NAME)
      console.log(`已找到索引: ${INDEX_NAME}`)
    }
    catch {
      console.log(`创建新索引: ${INDEX_NAME}`)
      await client.createIndex(INDEX_NAME, { primaryKey: 'id' })
    }

    const index = client.index(INDEX_NAME)

    // 设置索引配置
    await index.updateSettings({
      searchableAttributes: [
        'title',
        'description',
        'content',
      ],
      filterableAttributes: ['category', 'published'],
      sortableAttributes: ['createdAt', 'updatedAt'],
    })

    // 从数据库获取文章
    const articles = await getDatabaseArticles()
    console.log(`从数据库中找到 ${articles.length} 篇文章`)

    // 添加文章到索引
    if (articles.length > 0) {
      const task = await index.addDocuments(articles)
      console.log(`文章添加到索引中, taskId: ${task.taskUid}`)
    }

    console.log('索引完成!')
  }
  catch (error) {
    console.error('索引过程中出现错误:', error)
  }
}

// 从数据库中获取文章
async function getDatabaseArticles() {
  console.log('从数据库中获取文章...')

  try {
    // 查询所有已发布的文章及其关联数据
    const articlesRes = await getArticles()

    const articles = articlesRes.articles

    // 转换为可索引的格式
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description || '',
      content: article.content || '',
      slug: article.slug,
      category: article.category.name,
      tags: article.tags.map(tag => tag.name),
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt?.toISOString() || article.createdAt.toISOString(),
    }))
  }
  catch (error) {
    console.error('从数据库获取文章时出错:', error)
    return []
  }
}

// 运行索引脚本
indexArticles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('索引过程中发生错误:', error)
    process.exit(1)
  })
