import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { siteConfig } from '@/config/site'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Result<T, E = Error> = Success<T> | Failure<E>

interface Success<T> { data: T, error: null }
interface Failure<E> { data: null, error: E }

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    return { data: await promise, error: null }
  }
  catch (error) {
    return { data: null, error: error as E }
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function buildImgSrc(name: string): string {
  return `${siteConfig.imgAssetsDomain}/blog/${name}.webp`
}
