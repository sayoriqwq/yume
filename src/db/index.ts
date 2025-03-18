import process from 'process'
import { PrismaClient } from '@prisma/client'

declare const globalThis: {
  cachedprisma: PrismaClient
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
}
else {
  if (!globalThis.cachedprisma) {
    globalThis.cachedprisma = new PrismaClient()
  }
  prisma = globalThis.cachedprisma
}

export const db = prisma
