import path from 'path'
import process from 'process'
import { importMDXFiles } from '@/components/mdx/import'

async function main() {
  const sourceDir = path.join(process.cwd(), 'contents')

  try {
    await importMDXFiles({
      sourceDir,
      // categoryId: 1,
      // tags: ['默认标签'],
    })
    console.log('MDX 文件导入完成')
  }
  catch (error) {
    console.error('导入失败:', error)
    process.exit(1)
  }
}

main()
