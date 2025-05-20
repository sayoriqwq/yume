import type { NextRequest } from 'next/server'
import { generateRandomFilename, uploadFileToS3 } from '@/service/s3'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const maxDuration = 60 // 设置较长的执行时间，因为上传操作可能耗时

// 上传图片的最大大小（5MB）
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    // 验证用户是否已登录并具有管理权限
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { code: 4001, msg: '未授权操作' },
        { status: 401 },
      )
    }

    // 解析表单数据
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { code: 4000, msg: '未提供文件' },
        { status: 400 },
      )
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { code: 4000, msg: '只支持上传图片文件' },
        { status: 400 },
      )
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { code: 4000, msg: '文件大小不能超过5MB' },
        { status: 400 },
      )
    }

    // 生成随机文件名
    const filename = generateRandomFilename(file.name)

    // 将文件转换为Buffer
    // eslint-disable-next-line node/prefer-global/buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // 上传到S3
    const result = await uploadFileToS3(buffer, filename, file.type)

    // 返回成功响应
    return NextResponse.json({
      code: 1000,
      msg: '上传成功',
      data: {
        url: result.url,
        filename,
      },
    })
  }
  catch (error: any) {
    console.error('上传失败:', error)
    return NextResponse.json(
      { code: 5000, msg: `上传失败: ${error.message || '未知错误'}` },
      { status: 500 },
    )
  }
}
