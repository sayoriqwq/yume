import process from 'process'
import { PrismaClient } from '@/generated/client'

function prismaClientSingleton() {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaGlobal = prisma

export default prisma
