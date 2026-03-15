import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"

// PATCH /api/pedidos/[id] - Atualizar status do pedido
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { id } = params
    const { status } = await request.json()

    const pedido = await prisma.pedido.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(pedido)
  } catch (erro) {
    console.error('Erro ao atualizar status do pedido:', erro)
    return NextResponse.json(
      { erro: 'Erro ao atualizar status do pedido' },
      { status: 500 }
    )
  }
}
