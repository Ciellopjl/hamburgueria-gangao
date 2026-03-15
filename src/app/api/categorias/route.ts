import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

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
    const session = await getServerSession(authOptions)
    
    // Log para depuração na Vercel
    console.log('Tentativa de criação de categoria por:', session?.user?.email)

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      console.warn('Bloqueio de segurança: Usuário não autorizado ou sessão nula.')
      return NextResponse.json({ 
        erro: 'Não autorizado', 
        detalhes: session ? `Sessão ativa como: ${session.user?.email}` : 'O servidor não encontrou nenhuma sessão ativa (cookies ausentes ou inválidos).'
      }, { status: 401 })
    }

    const dados = await request.json()
    
    if (!dados.nome || !dados.label) {
      return NextResponse.json({ erro: 'Nome e Rótulo são obrigatórios' }, { status: 400 })
    }

    const categoria = await prisma.categoria.create({
      data: {
        nome: dados.nome,
        label: dados.label,
        icone: dados.icone || '🍔',
      },
    })
    
    console.log('Categoria criada com sucesso:', categoria.id)
    return NextResponse.json(categoria, { status: 201 })
  } catch (erro: any) {
    console.error('ERRO FATAL NA CRIAÇÃO DE CATEGORIA:', erro)
    
    // Tratamento de erro de nome duplicado (P2002)
    if (erro.code === 'P2002') {
      return NextResponse.json(
        { erro: 'Já existe uma categoria com este nome técnico (Slug).' },
        { status: 400 }
      )
    }

    return NextResponse.json({ erro: 'Erro interno ao salvar categoria: ' + (erro.message || 'Desconhecido') }, { status: 500 })
  }
}
