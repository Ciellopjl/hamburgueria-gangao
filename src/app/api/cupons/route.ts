import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/cupons - Listar todos os cupons
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.email !== "ciellolisboa023@gmail.com") {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const cupons = await prisma.cupom.findMany({
      orderBy: { criadoEm: 'desc' },
    })
    return NextResponse.json(cupons)
  } catch (erro) {
    console.error('Erro ao listar cupons:', erro)
    return NextResponse.json(
      { erro: 'Erro ao listar cupons' },
      { status: 500 }
    )
  }
}

// POST /api/cupons - Criar novo cupom
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.email !== "ciellolisboa023@gmail.com") {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const dados = await req.json()
    
    const cupom = await prisma.cupom.create({
      data: {
        codigo: dados.codigo.toUpperCase(),
        tipo: dados.tipo,
        valor: parseFloat(dados.valor),
        pedidoMinimo: parseFloat(dados.pedidoMinimo || 0),
        ativo: dados.ativo ?? true,
        validade: dados.validade ? new Date(dados.validade) : null,
      },
    })
    
    return NextResponse.json(cupom)
  } catch (erro) {
    console.error('Erro ao criar cupom:', erro)
    return NextResponse.json(
      { erro: 'Erro ao criar cupom' },
      { status: 500 }
    )
  }
}
