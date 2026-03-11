import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
