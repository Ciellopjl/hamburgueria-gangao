import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// PUT /api/produtos/[id] - Editar produto
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const dados = await request.json()
    const produto = await prisma.produto.update({
      where: { id: params.id },
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        preco: dados.preco,
        imagem: dados.imagem,
        categoriaId: dados.categoriaId,
        badge: dados.badge,
        disponivel: dados.disponivel,
      },
    })
    return NextResponse.json(produto)
  } catch (erro) {
    console.error('Erro ao editar produto:', erro)
    return NextResponse.json(
      { erro: 'Erro ao editar produto' },
      { status: 500 }
    )
  }
}

// DELETE /api/produtos/[id] - Excluir produto
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    await prisma.produto.delete({ where: { id: params.id } })
    return NextResponse.json({ mensagem: 'Produto excluído com sucesso' })
  } catch (erro) {
    console.error('Erro ao excluir produto:', erro)
    return NextResponse.json(
      { erro: 'Erro ao excluir produto' },
      { status: 500 }
    )
  }
}
