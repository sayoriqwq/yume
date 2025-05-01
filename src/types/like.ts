export enum LikeableType {
  ARTICLE = 'ARTICLE',
  COMMENT = 'COMMENT',
}

/**
 * 点赞操作参数
 */
export interface LikeActionParams {
  targetId: number
  type: LikeableType
  path: string
  userId: string
}

/**
 * 点赞状态
 */
export type LikeStatus = [boolean, number]

/**
 * 点赞操作响应
 */
export interface LikeResponse {
  success: boolean
  liked?: boolean
  count?: number
  error?: Error
}

/**
 * 批量点赞状态
 */
export type BatchLikeStatus = Record<string, LikeStatus>

/**
 * 点赞目标项
 */
export interface LikeTarget {
  id: number
  type: LikeableType
}
