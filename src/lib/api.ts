import type { Entity } from '@/atoms/dashboard/types'
import type { YumeError } from './YumeError'
import { NextResponse } from 'next/server'

// api返回值：{res: T, error: E | Error | null}
export interface ApiResponse<T, E = YumeError> {
  res: T
  error: E | Error | null
}

// 标准化 data 用于 jotai 数据存储层
export interface NormalizedData {
  data: Record<string, number[]>
  objects: Record<string, Record<number, any>>
}

/**
 * 创建单个实体的响应
 * @param data 实体对象
 */
export interface SingleData<T> {
  id: number
  data: T
}
export function createSingleEntityResponse<T extends Entity>(
  data: T,
) {
  return NextResponse.json<SingleData<T>>({
    id: data.id,
    data,
  })
}

export interface SingleDeleteData {
  success: boolean
}
export function createSingleDeleteResponse(success: boolean) {
  return NextResponse.json<SingleDeleteData>({
    success,
  })
}
