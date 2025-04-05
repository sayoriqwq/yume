import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

export enum YumeErrorType {
  ZodError = 'ZodError',
  PrismaError = 'PrismaError',
  ServerError = 'ServerError',
  NotFoundError = 'NotFoundError',
  BadRequestError = 'BadRequestError',
}

// 集中处理已知的错误
export class YumeError extends Error {
  statusCode: number
  errorType: string
  originalError: unknown

  toJSON() {
    return JSON.stringify({
      message: this.message,
      statusCode: this.statusCode,
      errorType: this.errorType,
      originalError: this.originalError,
    })
  }

  constructor(message: string, statusCode: number, errorType: string, originalError: unknown) {
    super(message)
    this.name = 'YumeError'
    this.statusCode = statusCode
    this.errorType = errorType
    this.originalError = originalError
  }
}

export function extractYumeError(error: string): YumeError {
  const { message, statusCode, errorType, originalError } = JSON.parse(error)
  return new YumeError(message, statusCode, errorType, originalError)
}

export function createYumeError(error: unknown, errorType?: YumeErrorType): YumeError {
  if (error instanceof ZodError) {
    const message = error.errors.map(e => e.message).join(', ')
    return new YumeError(message, 400, YumeErrorType.ZodError, error)
  }
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let message = error.message
    let statusCode = 500

    switch (error.code) {
      case 'P2002':
        message = '违反唯一约束'
        statusCode = 409
        break
      case 'P2019':
        message = '找不到记录'
        statusCode = 404
        break
      default:
        statusCode = 400
        break
    }
    return new YumeError(message, statusCode, YumeErrorType.PrismaError, error)
  }
  else if (error instanceof Error) {
    return new YumeError(error.message, 500, errorType ?? YumeErrorType.ServerError, error)
  }
  else {
    return new YumeError('你是怎么到这的？', 500, YumeErrorType.ServerError, error)
  }
}
