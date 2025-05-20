import process from 'process'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
// 配置 S3 客户端
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
})

// 生成随机文件名
export function generateRandomFilename(originalName: string): string {
  const extension = originalName.split('.').pop()
  const randomString = Math.random().toString(36).substring(2, 15)
  const timestamp = Date.now()
  return `${timestamp}-${randomString}.${extension}`
}

// 上传文件到 S3
// eslint-disable-next-line node/prefer-global/buffer
export async function uploadFileToS3(file: Buffer, filename: string, contentType: string) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!
  const key = `uploads/${filename}` // 可以根据需要调整存储路径

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  try {
    await s3Client.send(command)

    // 返回文件的公共URL
    return {
      url: `https://${bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`,
      key,
    }
  }
  catch (error) {
    console.error('S3上传错误:', error)
    throw error
  }
}
