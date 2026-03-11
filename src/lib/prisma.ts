import { PrismaClient } from '@prisma/client/index'
// @ts-ignore
import Database from 'better-sqlite3'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

// Singleton do PrismaClient para evitar múltiplas conexões em dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function criarPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: 'file:prisma/dev.db' })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || criarPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
