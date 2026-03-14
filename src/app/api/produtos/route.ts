import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/produtos - Listar todos os produtos
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: { categoria: true },
      orderBy: { criadoEm: 'desc' },
    })
    return NextResponse.json(produtos)
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro)
    return NextResponse.json(
      { erro: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

// POST /api/produtos - Criar novo produto (admin)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.email !== "ciellolisboa023@gmail.com") {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const dados = await request.json()
    const produto = await prisma.produto.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        preco: dados.preco,
        imagem: dados.imagem,
        categoriaId: dados.categoriaId,
        badge: dados.badge || null,
        disponivel: dados.disponivel ?? true,
      },
    })
    return NextResponse.json(produto, { status: 201 })
  } catch (erro) {
    console.error('Erro ao criar produto:', erro)
    return NextResponse.json(
      { erro: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}
