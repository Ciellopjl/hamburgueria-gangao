import { create } from 'zustand'
import { Produto, Categoria, Promocao, Cupom } from '@/data/types'

interface AdminState {
  produtos: Produto[]
  categorias: Categoria[]
  promocoes: Promocao[]
  carregando: boolean
  erro: string | null

  pedidos: any[]
  cupons: Cupom[]
  carregarDados: () => Promise<void>
  carregarPedidos: () => Promise<void>
  atualizarStatusPedido: (id: string, status: string) => Promise<void>
  limparPedidos: () => Promise<void>

  // CRUD de produtos
  adicionarProduto: (produto: Omit<Produto, 'id' | 'disponivel'>) => Promise<void>
  editarProduto: (id: string, dados: Partial<Produto>) => Promise<void>
  excluirProduto: (id: string) => Promise<void>

  // CRUD de categorias
  adicionarCategoria: (dados: { nome: string, label: string, icone: string }) => Promise<void>
  editarCategoria: (id: string, dados: Partial<Categoria>) => Promise<void>
  excluirCategoria: (id: string) => Promise<void>

  // CRUD de cupons
  carregarCupons: () => Promise<void>
  adicionarCupom: (dados: Omit<Cupom, 'id'>) => Promise<void>
  editarCupom: (id: string, dados: Partial<Cupom>) => Promise<void>
  excluirCupom: (id: string) => Promise<void>
}

export const useAdminStore = create<AdminState>((set, get) => ({
  produtos: [],
  categorias: [],
  promocoes: [],
  pedidos: [],
  cupons: [],
  carregando: false,
  erro: null,

  carregarDados: async () => {
    set({ carregando: true, erro: null })
    try {
      const [resProdutos, resCategorias] = await Promise.all([
        fetch('/api/produtos'),
        fetch('/api/categorias'),
      ])

      const produtos = await resProdutos.json()
      const categorias = await resCategorias.json()

      await get().carregarPedidos()
      await get().carregarCupons()
      
      set({ 
        produtos: Array.isArray(produtos) ? produtos : [], 
        categorias: Array.isArray(categorias) ? categorias : [], 
        carregando: false 
      })
    } catch (erro) {
      set({ erro: 'Erro ao carregar dados', carregando: false, produtos: [], categorias: [] })
    }
  },

  carregarPedidos: async () => {
    try {
      const res = await fetch('/api/pedidos')
      const pedidos = await res.json()
      set({ pedidos: Array.isArray(pedidos) ? pedidos : [] })
    } catch (erro) {
      console.error('Erro ao carregar pedidos:', erro)
      set({ pedidos: [] })
    }
  },

  atualizarStatusPedido: async (id, status) => {
    set({ carregando: true })
    try {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error('Erro ao atualizar pedido')

      await get().carregarPedidos()
      set({ carregando: false })
    } catch (erro) {
      set({ erro: 'Erro ao atualizar status', carregando: false })
    }
  },

  adicionarProduto: async (produto: Omit<Produto, 'id' | 'disponivel'>) => {
    set({ carregando: true })
    try {
      const res = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      })

      if (!res.ok) throw new Error('Erro ao adicionar produto')

      await get().carregarDados()
    } catch (erro) {
      set({ erro: 'Erro ao adicionar produto', carregando: false })
    }
  },

  editarProduto: async (id: string, dados: Partial<Produto>) => {
    set({ carregando: true })
    try {
      const res = await fetch(`/api/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })

      if (!res.ok) throw new Error('Erro ao editar produto')

      await get().carregarDados()
    } catch (erro) {
      set({ erro: 'Erro ao editar produto', carregando: false })
    }
  },

  excluirProduto: async (id: string) => {
    set({ carregando: true })
    try {
      const res = await fetch(`/api/produtos/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Erro ao excluir produto')

      await get().carregarDados()
    } catch (erro) {
      set({ erro: 'Erro ao excluir produto', carregando: false })
    }
  },

  adicionarCategoria: async (dados: { nome: string, label: string, icone: string }) => {
    set({ carregando: true })
    try {
      const res = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })
      if (!res.ok) throw new Error('Erro ao adicionar categoria')
      await get().carregarDados()
    } catch (erro) {
      set({ erro: 'Erro ao adicionar categoria', carregando: false })
    }
  },

  editarCategoria: async (id: string, dados: Partial<Categoria>) => {
    set({ carregando: true })
    try {
      const res = await fetch(`/api/categorias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })
      if (!res.ok) throw new Error('Erro ao editar categoria')
      await get().carregarDados()
    } catch (erro) {
      set({ erro: 'Erro ao editar categoria', carregando: false })
    }
  },

  excluirCategoria: async (id: string) => {
    set({ carregando: true })
    try {
      const res = await fetch(`/api/categorias/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Erro ao excluir categoria')
      await get().carregarDados()
    } catch (erro) {
      set({ erro: 'Erro ao excluir categoria', carregando: false })
    }
  },

  limparPedidos: async () => {
    set({ carregando: true })
    try {
      const res = await fetch('/api/pedidos', {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Erro ao limpar pedidos')
      await get().carregarPedidos()
      set({ carregando: false })
    } catch (erro) {
      set({ erro: 'Erro ao limpar pedidos', carregando: false })
    }
  },

  carregarCupons: async () => {
    try {
      const res = await fetch('/api/cupons')
      const data = await res.json()
      
      if (Array.isArray(data)) {
        set({ cupons: data })
      } else {
        set({ cupons: [], erro: data.erro || 'Erro ao carregar cupons' })
      }
    } catch (erro) {
      console.error('Erro ao carregar cupons:', erro)
      set({ cupons: [], erro: 'Erro de conexão ao carregar cupons' })
    }
  },

  adicionarCupom: async (dados) => {
    set({ carregando: true })
    try {
      const res = await fetch('/api/cupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })
      if (!res.ok) throw new Error('Erro ao adicionar cupom')
      await get().carregarCupons()
      set({ carregando: false })
    } catch (erro) {
      set({ erro: 'Erro ao adicionar cupom', carregando: false })
    }
  },

  editarCupom: async (id, dados) => {
    set({ carregando: true })
    try {
      const res = await fetch(`/api/cupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })
      if (!res.ok) throw new Error('Erro ao editar cupom')
      await get().carregarCupons()
      set({ carregando: false })
    } catch (erro) {
      set({ erro: 'Erro ao editar cupom', carregando: false })
    }
  },

  excluirCupom: async (id) => {
    set({ carregando: true })
    try {
      const res = await fetch(`/api/cupons/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Erro ao excluir cupom')
      await get().carregarCupons()
      set({ carregando: false })
    } catch (erro) {
      set({ erro: 'Erro ao excluir cupom', carregando: false })
    }
  },
}))
