import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"

// GET /api/categorias - Listar
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { label: 'asc' },
    })
    return NextResponse.json(categorias)
  } catch (erro) {
    return NextResponse.json({ erro: 'Erro' }, { status: 500 })
  }
}

// POST /api/categorias - Criar
export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session || session.user?.email !== "ciellolisboa023@gmail.com") {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const dados = await request.json()
    const categoria = await prisma.categoria.create({
      data: {
        nome: dados.nome,
        label: dados.label,
        icone: dados.icone,
      },
    })
    return NextResponse.json(categoria, { status: 201 })
  } catch (erro) {
    return NextResponse.json({ erro: 'Erro' }, { status: 500 })
  }
}
