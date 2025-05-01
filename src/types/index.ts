import type { PropsWithChildren } from 'react'

export type PropsWithCC<T = unknown> = PropsWithChildren<T> & { className?: string }

export * from './comment'
export * from './friend'
export * from './like'
export * from './page'
export * from './result'
export * from './user'
