import 'dotenv/config'
import { prisma } from './src/lib/prisma'

async function tryPrisma() {
   const users = await prisma.allowedEmail.findMany()
   console.log("Success! Users:", users)
}
tryPrisma().catch(e => console.error(e)).finally(() => prisma.$disconnect())
