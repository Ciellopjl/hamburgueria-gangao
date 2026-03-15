import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const allowed = await prisma.allowedEmail.findMany()
  console.log("Allowed Emails in DB:", allowed)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
