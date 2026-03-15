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
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Tentativa de criação de produto por:', session?.user?.email)

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      console.warn('Bloqueio de segurança: Usuário não autorizado ou sessão nula.')
      return NextResponse.json({ 
        erro: 'Não autorizado', 
        detalhes: session ? `Sessão ativa como: ${session.user?.email}` : 'O servidor não encontrou nenhuma sessão ativa (cookies ausentes ou inválidos).'
      }, { status: 401 })
    }

    const dados = await request.json()
    
    // Validação básica de servidor
    if (!dados.nome || !dados.categoriaId || isNaN(parseFloat(dados.preco))) {
      return NextResponse.json({ erro: 'Dados incompletos ou inválidos' }, { status: 400 })
    }

    const produto = await prisma.produto.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao || '',
        preco: parseFloat(dados.preco),
        imagem: dados.imagem || '',
        categoriaId: dados.categoriaId,
        badge: dados.badge || null,
        disponivel: dados.disponivel ?? true,
      },
    })

    console.log('Produto criado com sucesso:', produto.id)
    return NextResponse.json(produto, { status: 201 })
  } catch (erro: any) {
    console.error('ERRO FATAL NA CRIAÇÃO DE PRODUTO:', erro)
    return NextResponse.json(
      { erro: 'Erro interno ao criar produto: ' + (erro.message || 'Erro de banco de dados') },
      { status: 500 }
    )
  }
}
