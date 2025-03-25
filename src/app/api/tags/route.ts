import type { Tag } from '@/atoms/appData/store'
import { db } from '@/db'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<Tag[] | { error: string }>> {
  try {
    const tags = await db.tag.findMany()

    if (!tags || tags.length === 0) {
      console.log('Warning: No tags found in database')
    }

    console.log('API Response - tags count:', tags.length)

    return NextResponse.json(tags)
  }
  catch (error) {
    console.error('获取标签失败:', error)
    return NextResponse.json({ error: '获取标签失败' }, { status: 500 })
  }
}
