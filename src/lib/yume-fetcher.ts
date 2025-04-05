import process from 'process'
import { createYumeError, YumeError } from './YumeError'

interface FetchOptions {
  headers?: Record<string, string>
  query?: Record<string, string | number>
  body?: Record<string, unknown>
  formData?: FormData
  cache?: RequestCache
  next?: NextFetchRequestConfig
}

async function yumeFetcher<T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', options?: FetchOptions): Promise<T> {
  try {
    const { headers = {}, query, body, formData, cache, next } = options || {}

    const queryString = query
      ? `?${
        Object.entries(query)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      : ''

    const base = process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_API_URL_DEV
      : process.env.NEXT_PUBLIC_API_URL_PROD

    const fullUrl = `${base}/api${url}${queryString}`

    const fetchOptions: RequestInit = {
      method,
      headers: {
        ...headers,
      },
      cache,
      next,
    }

    if (formData) {
      fetchOptions.body = formData
    }
    else if (body) {
      fetchOptions.headers = { ...fetchOptions.headers, 'Content-Type': 'application/json' }
      fetchOptions.body = JSON.stringify(body)
    }

    const response = await fetch(fullUrl, fetchOptions)

    if (!response.ok) {
      throw new YumeError(
        '请求失败',
        response.status,
        'FetchError',
        new Error(`HTTP error! status: ${response.status}`),
      )
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T
    }

    return await response.json()
  }
  catch (error) {
    if (error instanceof YumeError) {
      throw error
    }
    else {
      throw createYumeError(error)
    }
  }
}

type YumeFetchOptions = Pick<FetchOptions, 'cache' | 'next' | 'headers'>

export async function yumeFetchGet<T>(url: string, query?: Record<string, string | number>, options?: YumeFetchOptions): Promise<T> {
  return yumeFetcher<T>(url, 'GET', { query, ...options })
}

export async function yumeFetchPost<T>(url: string, body?: Record<string, unknown>, options?: YumeFetchOptions): Promise<T> {
  return yumeFetcher<T>(url, 'POST', { body, ...options })
}

export async function yumeFetchPut<T>(url: string, body?: Record<string, unknown>, options?: YumeFetchOptions): Promise<T> {
  return yumeFetcher<T>(url, 'PUT', { body, ...options })
}

export async function yumeFetchPatch<T>(url: string, body?: Record<string, unknown>, options?: YumeFetchOptions): Promise<T> {
  return yumeFetcher<T>(url, 'PATCH', { body, ...options })
}

export async function yumeFetchDelete<T>(url: string, query?: Record<string, string | number>, options?: YumeFetchOptions): Promise<T> {
  return yumeFetcher<T>(url, 'DELETE', { query, ...options })
}

export async function yumeFetchFormData<T>(url: string, formData?: FormData, options?: YumeFetchOptions): Promise<T> {
  if (!formData) {
    throw new Error('formData is required for yumeFetchFormData')
  }
  return yumeFetcher<T>(url, 'POST', { formData, ...options })
}
