import type { NextRequest } from 'next/server'
import type { z, ZodSchema } from 'zod'

export function parseGetQuery<T extends ZodSchema>(request: NextRequest, schema: T): z.infer<T> {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const query = Object.fromEntries(searchParams.entries())
  return schema.parse(query)
}

export async function parsePostBody<T extends ZodSchema>(request: NextRequest, schema: T): Promise<z.infer<T>> {
  const body = await request.json()
  return schema.parse(body)
}

export async function parsePutBody<T extends ZodSchema>(request: NextRequest, schema: T): Promise<z.infer<T>> {
  return parsePostBody(request, schema)
}

export function parseDeleteQuery<T extends ZodSchema>(request: NextRequest, schema: T): z.infer<T> {
  return parseGetQuery(request, schema)
}

export function parsePatchBody<T extends ZodSchema>(request: NextRequest, schema: T): Promise<z.infer<T>> {
  return parsePostBody(request, schema)
}
