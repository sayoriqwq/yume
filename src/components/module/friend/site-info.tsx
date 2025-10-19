import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { MDXContent } from '@/features/mdx/mdx-content'

export async function SiteInfo() {
  async function getSiteInfo() {
    const filePath = path.join(process.cwd(), 'src/components/module/friend/site-info.mdx')
    const source = await fs.readFile(filePath, 'utf-8')
    return source
  }

  const content = await getSiteInfo()
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXContent code={content} />
    </div>
  )
}
