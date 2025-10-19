import process from 'node:process'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '../app/generated/prisma'

// eslint-disable-next-line no-restricted-globals
const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma

export default prisma
