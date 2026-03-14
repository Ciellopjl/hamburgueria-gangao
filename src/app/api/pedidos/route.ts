import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"

// GET /api/pedidos - Listar pedidos (admin)
export async function GET() {
  const session = await getServerSession()
  if (!session || session.user?.email !== "ciellolisboa023@gmail.com") {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { criadoEm: 'desc' },
    })
    return NextResponse.json(pedidos)
  } catch (erro) {
    console.error('Erro ao buscar pedidos:', erro)
    return NextResponse.json(
      { erro: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}

// POST /api/pedidos - Criar pedido
export async function POST(request: Request) {
  try {
    const dados = await request.json()
    const pedido = await prisma.pedido.create({
      data: {
        nomeCliente: dados.nomeCliente,
        telefone: dados.telefone,
        endereco: dados.endereco,
        bairro: dados.bairro,
        itens: JSON.stringify(dados.itens),
        total: dados.total,
        formaPagamento: dados.formaPagamento,
        trocoParaValor: dados.trocoParaValor || null,
        observacoes: dados.observacoes || null,
      },
    })
    return NextResponse.json(pedido, { status: 201 })
  } catch (erro) {
    console.error('Erro ao criar pedido:', erro)
    return NextResponse.json(
      { erro: 'Erro ao criar pedido' },
      { status: 500 }
    )
  }
}
// DELETE /api/pedidos - Limpar todos os pedidos
export async function DELETE() {
  const session = await getServerSession()
  if (!session || session.user?.email !== "ciellolisboa023@gmail.com") {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    await prisma.pedido.deleteMany()
    return NextResponse.json({ mensagem: 'Pedidos limpos com sucesso' })
  } catch (erro) {
    console.error('Erro ao limpar pedidos:', erro)
    return NextResponse.json(
      { erro: 'Erro ao limpar pedidos' },
      { status: 500 }
    )
  }
}
