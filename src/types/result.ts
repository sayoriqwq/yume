import type { YumeError } from '@/lib/YumeError'

export type Result<T, E = YumeError> = Success<T> | Failure<E>

export interface Success<T> { data: T, error: null }
export interface Failure<E> { data: null, error: E }
