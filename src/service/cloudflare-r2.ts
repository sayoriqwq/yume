import type { DeleteObjectsCommandInput } from '@aws-sdk/client-s3'

import { createReadStream, existsSync } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { posix, relative, resolve } from 'node:path'
import process from 'node:process'

import { DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { lookup as lookupMimeType } from 'mime-types'
import sharp from 'sharp'
import { siteConfig } from '@/config/site'

export interface CloudflareR2Config {
  bucket: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  region?: string
}

export interface SyncDirectoryOptions {
  prefix?: string
  dryRun?: boolean
}

export interface SyncDirectoryResult {
  uploaded: string[]
  deleted: string[]
}

interface FileDescriptor {
  absolutePath: string
  relativeKey: string
  size: number
  lastModified: Date
}

interface UploadDescriptor extends FileDescriptor {
  targetKey: string
  contentType: string
  convertToWebp: boolean
  legacyKey?: string
}

const DEFAULT_REGION = 'auto'
const MAX_DELETE_BATCH = 1000
const WEBP_MIME_TYPE = 'image/webp'
const CONVERTIBLE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/tiff',
  'image/bmp',
  'image/avif',
])
const MANAGED_IMAGE_EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.bmp', '.tiff', '.avif']

function replaceExtensionWithWebp(key: string) {
  const lastDot = key.lastIndexOf('.')
  if (lastDot === -1) {
    return `${key}.webp`
  }
  return `${key.slice(0, lastDot)}.webp`
}

function shouldConvertToWebp(mimeType: string) {
  if (mimeType === WEBP_MIME_TYPE) {
    return false
  }
  return CONVERTIBLE_MIME_TYPES.has(mimeType)
}

function isManagedImageKey(key: string) {
  const lowerKey = key.toLowerCase()
  return MANAGED_IMAGE_EXTENSIONS.some(ext => lowerKey.endsWith(ext))
}

function chunkArray<T>(items: T[], size: number) {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size))
  }
  return result
}

async function walkDirectory(baseDir: string, currentDir = baseDir) {
  const entries = await readdir(currentDir, { withFileTypes: true })
  const files: FileDescriptor[] = []

  await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = resolve(currentDir, entry.name)
      if (entry.isDirectory()) {
        const nestedFiles = await walkDirectory(baseDir, absolutePath)
        files.push(...nestedFiles)
        return
      }

      if (!entry.isFile()) {
        return
      }

      const fileStat = await stat(absolutePath)
      files.push({
        absolutePath,
        relativeKey: posix.normalize(relative(baseDir, absolutePath).split('\\').join('/')),
        size: fileStat.size,
        lastModified: fileStat.mtime,
      })
    }),
  )

  return files
}

function resolveConfig(overrides: Partial<CloudflareR2Config> = {}): CloudflareR2Config {
  const bucket = overrides.bucket ?? process.env.R2_BUCKET_NAME
  const accessKeyId = overrides.accessKeyId ?? process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = overrides.secretAccessKey ?? process.env.R2_SECRET_ACCESS_KEY
  const envEndpoint = process.env.R2_ENDPOINT
  const accountEndpoint = process.env.R2_ACCOUNT_ID
    ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : undefined
  const endpoint = overrides.endpoint ?? envEndpoint ?? accountEndpoint

  const missing = [
    ['R2_BUCKET_NAME', bucket],
    ['R2_ACCESS_KEY_ID', accessKeyId],
    ['R2_SECRET_ACCESS_KEY', secretAccessKey],
    ['R2_ENDPOINT', endpoint],
  ].filter(([, value]) => !value)

  if (missing.length > 0) {
    const formatted = missing.map(([key]) => key).join(', ')
    throw new Error(`Missing Cloudflare R2 configuration: ${formatted}`)
  }

  return {
    bucket: bucket!,
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
    endpoint: endpoint!,
    region: overrides.region ?? process.env.R2_REGION ?? DEFAULT_REGION,
  }
}

function createR2Client(config: CloudflareR2Config) {
  return new S3Client({
    region: config.region ?? DEFAULT_REGION,
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })
}

async function listRemoteKeys(client: S3Client, bucket: string, prefix?: string) {
  const keys: string[] = []
  let continuation: string | undefined

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuation,
      }),
    )

    for (const object of response.Contents ?? []) {
      if (object.Key) {
        keys.push(object.Key)
      }
    }

    continuation = response.IsTruncated ? response.NextContinuationToken : undefined
  } while (continuation)

  return keys
}

async function deleteRemoteKeys(client: S3Client, bucket: string, keys: string[]) {
  if (keys.length === 0) {
    return
  }

  const batches = chunkArray(keys, MAX_DELETE_BATCH)

  for (const batch of batches) {
    const input: DeleteObjectsCommandInput = {
      Bucket: bucket,
      Delete: {
        Objects: batch.map(Key => ({ Key })),
        Quiet: true,
      },
    }

    await client.send(new DeleteObjectsCommand(input))
  }
}

async function uploadFiles(client: S3Client, bucket: string, files: UploadDescriptor[]) {
  const uploads = files.map(async (file) => {
    const body = file.convertToWebp
      ? await sharp(file.absolutePath).webp().toBuffer()
      : createReadStream(file.absolutePath)

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: file.targetKey,
        Body: body,
        ContentType: file.contentType,
      }),
    )
  })

  await Promise.all(uploads)

  return files.map(file => file.targetKey)
}

export async function syncDirectoryToR2(
  sourceDir: string,
  options: SyncDirectoryOptions = {},
  overrides: Partial<CloudflareR2Config> = {},
): Promise<SyncDirectoryResult> {
  const config = resolveConfig(overrides)
  const client = createR2Client(config)
  const source = resolve(sourceDir)

  const files = await walkDirectory(source)
  const uploadDescriptors = files.reduce<UploadDescriptor[]>((acc, file) => {
    const mimeType = lookupMimeType(file.absolutePath)
    if (typeof mimeType !== 'string' || !mimeType.startsWith('image/')) {
      return acc
    }

    const prefixedKey = options.prefix ? posix.join(options.prefix, file.relativeKey) : file.relativeKey
    const convertToWebp = shouldConvertToWebp(mimeType)
    const targetKey = convertToWebp ? replaceExtensionWithWebp(prefixedKey) : prefixedKey

    acc.push({
      ...file,
      targetKey,
      contentType: convertToWebp ? WEBP_MIME_TYPE : mimeType,
      convertToWebp,
      legacyKey: convertToWebp && prefixedKey !== targetKey ? prefixedKey : undefined,
    })

    return acc
  }, [])

  const expectedKeys = new Set(uploadDescriptors.map(file => file.targetKey))
  const legacyKeys = new Set(uploadDescriptors.flatMap(file => (file.legacyKey ? [file.legacyKey] : [])))

  const remoteKeys = await listRemoteKeys(client, config.bucket, options.prefix)
  const orphanedKeys = remoteKeys.filter(key => legacyKeys.has(key) || (isManagedImageKey(key) && !expectedKeys.has(key)))

  if (options.dryRun) {
    return { uploaded: uploadDescriptors.map(file => file.targetKey), deleted: orphanedKeys }
  }

  const uploadedKeys = await uploadFiles(client, config.bucket, uploadDescriptors)
  await deleteRemoteKeys(client, config.bucket, orphanedKeys)

  return {
    uploaded: uploadedKeys,
    deleted: orphanedKeys,
  }
}

export function getPublicAssetUrl(key: string) {
  const publicDomain = process.env.R2_PUBLIC_DOMAIN ?? siteConfig.assetsDomain
  const trimmedDomain = publicDomain.replace(/\/$/, '')
  const normalizedKey = key.startsWith('/') ? key.slice(1) : key
  return `${trimmedDomain}/${normalizedKey}`
}

export async function syncAssets() {
  const syncFlag = process.env.VELITE_SYNC
  const shouldSync = syncFlag === '1' || syncFlag?.toLowerCase() === 'true' || process.env.NODE_ENV === 'production'

  if (!shouldSync) {
    return
  }

  const requiredEnvVars = ['R2_BUCKET_NAME', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']
  const missing = requiredEnvVars.filter(key => !process.env[key])
  const hasEndpoint = Boolean(process.env.R2_ENDPOINT || process.env.R2_ACCOUNT_ID)

  if (missing.length > 0 || !hasEndpoint) {
    console.warn(
      '[velite] 跳过 R2 同步：缺少必要的环境变量 ->',
      [...missing, hasEndpoint ? null : 'R2_ENDPOINT | R2_ACCOUNT_ID'].filter(Boolean).join(', '),
    )
    return
  }

  if (!existsSync('public/static')) {
    console.warn('[velite] 跳过 R2 同步：没有检测到 public/static 目录')
    return
  }

  try {
    const { uploaded, deleted } = await syncDirectoryToR2('public/static', { prefix: 'blog' })
    // eslint-disable-next-line no-console
    console.log(
      `[velite] 已同步 public/static 至 R2：上传 ${uploaded.length} 个文件，删除 ${deleted.length} 个冗余文件`,
    )
  }
  catch (error) {
    console.error('[velite] 同步 R2 失败：', error)
    throw error
  }
}
