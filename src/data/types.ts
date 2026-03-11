// Tipos TypeScript para o sistema Mega Lanche do Gangão

export interface Categoria {
  id: string
  nome: string
  label: string
  icone: string
  produtos?: Produto[]
}

export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  imagem: string
  disponivel: boolean
  badge?: string | null
  categoriaId: string
  categoria?: Categoria
}

export interface ItemCarrinho {
  produto: Produto
  quantidade: number
  observacoes?: string
}

export interface DadosPedido {
  nomeCliente: string
  telefone: string
  endereco: string
  bairro: string
  formaPagamento: 'pix' | 'dinheiro' | 'cartao'
  trocoParaValor?: string
  observacoes?: string
}

export interface Pedido {
  id: string
  nomeCliente: string
  telefone: string
  endereco: string
  bairro: string
  itens: string
  total: number
  formaPagamento: string
  trocoParaValor?: string | null
  observacoes?: string | null
  status: string
  criadoEm: string
}

export interface Promocao {
  id: string
  titulo: string
  descricao: string
  tag: string
  icone: string
  cor: string
  corBorda: string
}

export interface Cupom {
  id: string
  codigo: string
  tipo: 'porcentagem' | 'valor'
  valor: number
  pedidoMinimo: number
  ativo: boolean
  validade?: string | null
}