import type { Tag } from '@/atoms/appData/store'
import { db } from '@/db'
import { NextResponse } from 'next/server'

interface TagsResponse {
  data: {
    tagIds: number[]
  }
  objects: {
    tags: Record<number, Tag>
  }
}

export async function GET(): Promise<NextResponse<TagsResponse | { error: string }>> {
  try {
    const tags = await db.tag.findMany()

    if (!tags || tags.length === 0) {
      console.log('Warning: No tags found in database')
    }

    const tagsData = tags.reduce<Record<number, Tag>>((acc, tag) => {
      acc[tag.id] = tag
      return acc
    }, {})

    console.log('API Response - tags count:', tags.length)

    return NextResponse.json({
      data: {
        tagIds: tags.map(tag => tag.id),
      },
      objects: {
        tags: tagsData,
      },
    })
  }
  catch (error) {
    console.error('获取标签失败:', error)
    return NextResponse.json({ error: '获取标签失败' }, { status: 500 })
  }
}
