import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"

// PUT /api/categorias/[id] - Editar
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session || session.user?.email !== "ciellolisboa023@gmail.com") {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }
  
  try {
    const { id } = params
    const dados = await request.json()
    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        nome: dados.nome,
        label: dados.label,
        icone: dados.icone,
      },
    })
    return NextResponse.json(categoria)
  } catch (erro) {
    return NextResponse.json({ erro: 'Erro' }, { status: 500 })
  }
}

// DELETE /api/categorias/[id] - Excluir
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session || session.user?.email !== "ciellolisboa023@gmail.com") {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { id } = params
    await prisma.categoria.delete({
      where: { id },
    })
    return NextResponse.json({ ok: true })
  } catch (erro) {
    return NextResponse.json({ erro: 'Erro' }, { status: 500 })
  }
}
