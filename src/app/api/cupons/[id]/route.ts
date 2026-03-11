import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/cupons/[id] - Editar cupom
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dados = await req.json()
    const { id } = params
    
    const cupom = await prisma.cupom.update({
      where: { id },
      data: {
        codigo: dados.codigo?.toUpperCase(),
        tipo: dados.tipo,
        valor: dados.valor !== undefined ? parseFloat(dados.valor) : undefined,
        pedidoMinimo: dados.pedidoMinimo !== undefined ? parseFloat(dados.pedidoMinimo) : undefined,
        ativo: dados.ativo,
        validade: dados.validade ? new Date(dados.validade) : null,
      },
    })
    
    return NextResponse.json(cupom)
  } catch (erro) {
    console.error('Erro ao editar cupom:', erro)
    return NextResponse.json(
      { erro: 'Erro ao editar cupom' },
      { status: 500 }
    )
  }
}

// DELETE /api/cupons/[id] - Excluir cupom
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await prisma.cupom.delete({
      where: { id },
    })
    return NextResponse.json({ mensagem: 'Cupom excluído com sucesso' })
  } catch (erro) {
    console.error('Erro ao excluir cupom:', erro)
    return NextResponse.json(
      { erro: 'Erro ao excluir cupom' },
      { status: 500 }
    )
  }
}
