import process from 'process'
import { PrismaClient } from '@/generated'

declare const globalThis: {
  cachedprisma: PrismaClient
}

// eslint-disable-next-line import/no-mutable-exports
let prismaSingleton: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prismaSingleton = new PrismaClient()
}
else {
  if (!globalThis.cachedprisma) {
    globalThis.cachedprisma = new PrismaClient()
  }
  prismaSingleton = globalThis.cachedprisma
}

export default prismaSingleton
