import type { NextRequest } from 'next/server'
import type { z, ZodSchema } from 'zod'
import type { YumeError } from './YumeError'
import { createYumeError } from './YumeError'

export function parseGetQuery<T extends ZodSchema>(request: NextRequest, schema: T): z.infer<T> | YumeError {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const query = Object.fromEntries(searchParams.entries())

  console.log('query', query)
  const res = schema.safeParse(query)
  if (!res.success) {
    return createYumeError(res.error)
  }
  return res.data
}

export async function parsePostBody<T extends ZodSchema>(request: NextRequest, schema: T): Promise<z.infer<T> | YumeError> {
  const body = await request.json()
  const res = schema.safeParse(body)
  if (!res.success) {
    return createYumeError(res.error)
  }
  return res.data
}

export async function parsePutBody<T extends ZodSchema>(request: NextRequest, schema: T): Promise<z.infer<T> | YumeError> {
  return parsePostBody(request, schema)
}

export function parseDeleteQuery<T extends ZodSchema>(request: NextRequest, schema: T): z.infer<T> | YumeError {
  return parseGetQuery(request, schema)
}

export function parsePatchBody<T extends ZodSchema>(request: NextRequest, schema: T): Promise<z.infer<T> | YumeError> {
  return parsePostBody(request, schema)
}
