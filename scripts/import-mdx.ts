import process from 'process'
import { importMDXFiles } from '@/components/mdx/import'
import { fullPath } from '@/components/mdx/posts-utils'
import * as dotenv from 'dotenv'

// 显示加载环境变量
dotenv.config()

async function main() {
  const sourceDir = fullPath

  try {
    await importMDXFiles({
      sourceDir,
    })
    console.log('MDX 文件导入完成')
  }
  catch (error) {
    console.error('导入失败:', error)
    process.exit(1)
  }
}

main()
