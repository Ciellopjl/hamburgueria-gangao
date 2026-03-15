'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const BOSS_EMAIL = "ciellolisboa023@gmail.com"

async function checkIsBoss() {
  const session = await getServerSession(authOptions)
  return session?.user?.email === BOSS_EMAIL
}

export async function listWhitelist() {
  if (!await checkIsBoss()) {
    throw new Error('Não autorizado')
  }

      // @ts-ignore
      return prisma.allowedEmail.findMany({
        orderBy: { criadoEm: 'desc' }
      })
}

export async function addToWhitelist(email: string) {
  if (!await checkIsBoss()) {
    throw new Error('Não autorizado')
  }

  if (!email || !email.includes('@')) {
    throw new Error('Email inválido')
  }

  // @ts-ignore
  await prisma.allowedEmail.create({
    data: { email: email.toLowerCase().trim() }
  })

  revalidatePath('/admin/liberacao')
}

export async function removeFromWhitelist(id: string) {
  if (!await checkIsBoss()) {
    throw new Error('Não autorizado')
  }

  // @ts-ignore
  await prisma.allowedEmail.delete({
    where: { id }
  })

  revalidatePath('/admin/liberacao')
}
