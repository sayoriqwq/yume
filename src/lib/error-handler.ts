import toast from 'react-hot-toast'
import { extractYumeError, YumeError } from './YumeError'

export function yumeErrorHandler<T>(res: T | string, successMessage: string, successCb?: () => void) {
  if (res instanceof YumeError) {
    toast.error(res.message)
  }
  else if (typeof res === 'string') {
    const error = extractYumeError(res)
    toast.error(error.message)
  }
  else {
    toast.success(successMessage)
    successCb?.()
  }
}

export async function yumeErrorHandlerAsync<T>(res: T | YumeError): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (res instanceof YumeError) {
      toast.error(res.message)
      reject(res)
    }
    else {
      resolve(res)
    }
  })
}

export function errorLogger(error: unknown) {
  if (error instanceof YumeError) {
    console.error('YumeError:', error.toJSON())
  }
  else {
    console.error('Unknown error:', error)
  }
}

export function errorToaster(error: unknown) {
  if (error instanceof YumeError) {
    toast.error(error.message)
  }
  else if (error instanceof Error) {
    toast.error(error.message)
  }
  else {
    toast.error('未知错误')
  }
}
