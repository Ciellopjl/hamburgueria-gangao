import { create } from 'zustand'
import { ItemCarrinho, Produto } from '@/data/types'

interface CarrinhoState {
  itens: ItemCarrinho[]
  aberto: boolean
  abrirCarrinho: () => void
  fecharCarrinho: () => void
  toggleCarrinho: () => void
  adicionarItem: (produto: Produto, observacoes?: string) => void
  removerItem: (produtoId: string, observacoes?: string) => void
  alterarQuantidade: (produtoId: string, quantidade: number, observacoes?: string) => void
  limparCarrinho: () => void
  total: () => number
  quantidadeTotal: () => number
}

export const useCarrinhoStore = create<CarrinhoState>((set, get) => ({
  itens: [],
  aberto: false,

  abrirCarrinho: () => set({ aberto: true }),
  fecharCarrinho: () => set({ aberto: false }),
  toggleCarrinho: () => set((state) => ({ aberto: !state.aberto })),

  adicionarItem: (produto: Produto, observacoes?: string) => {
    set((state) => {
      const itemExistente = state.itens.find(
        (item) => 
          item.produto.id === produto.id && 
          item.observacoes === observacoes
      )

      if (itemExistente) {
        return {
          itens: state.itens.map((item) =>
            item.produto.id === produto.id && item.observacoes === observacoes
              ? { ...item, quantidade: item.quantidade + 1 }
              : item
          ),
          aberto: true,
        }
      }

      return {
        itens: [...state.itens, { produto, quantidade: 1, observacoes }],
        aberto: true,
      }
    })
  },

  removerItem: (produtoId: string, observacoes?: string) => {
    set((state) => ({
      itens: state.itens.filter(
        (item) => !(item.produto.id === produtoId && item.observacoes === observacoes)
      ),
    }))
  },

  alterarQuantidade: (produtoId: string, quantidade: number, observacoes?: string) => {
    if (quantidade <= 0) {
      get().removerItem(produtoId, observacoes)
      return
    }

    set((state) => ({
      itens: state.itens.map((item) =>
        item.produto.id === produtoId && item.observacoes === observacoes 
          ? { ...item, quantidade } 
          : item
      ),
    }))
  },

  limparCarrinho: () => set({ itens: [], aberto: false }),

  total: () => {
    const { itens } = get()
    return itens.reduce(
      (total, item) => total + item.produto.preco * item.quantidade,
      0
    )
  },

  quantidadeTotal: () => {
    const { itens } = get()
    return itens.reduce((total, item) => total + item.quantidade, 0)
  },
}))
