import type { ClassValue } from 'clsx'
import type { YumeError } from './errors/YumeError'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Result<T, E = YumeError> = Success<T> | Failure<E>

interface Success<T> { data: T, error: null }
interface Failure<E> { data: null, error: E }

export async function tryCatch<T, E = YumeError>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    return { data: await promise, error: null }
  }
  catch (error) {
    return { data: null, error: error as E }
  }
}
