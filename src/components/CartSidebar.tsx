'use client'

import { X, Minus, Plus, ShoppingBag, Trash2, MessageSquare } from 'lucide-react'
import { useCarrinhoStore } from '@/store/cartStore'
import { formatarPreco } from '@/lib/utils'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartSidebar() {
  const {
    itens,
    aberto,
    fecharCarrinho,
    removerItem,
    alterarQuantidade,
    total,
    limparCarrinho,
  } = useCarrinhoStore()

  return (
    <AnimatePresence>
      {aberto && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={fecharCarrinho}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-marca-pretoClaro 
                       border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header do carrinho */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-red-500 shrink-0" />
                <h2 className="text-sm md:text-lg font-display font-bold truncate">Seu Pedido</h2>
                <span className="bg-red-600 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {itens.length}
                </span>
              </div>
              <button
                onClick={fecharCarrinho}
                className="p-1.5 md:p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0"
                aria-label="Fechar carrinho"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de itens */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4">
              {itens.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-gray-700 mb-4" />
                  <p className="text-gray-500 text-base md:text-lg font-medium mb-1 md:mb-2">
                    Carrinho vazio
                  </p>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Adicione itens do cardápio para começar
                  </p>
                </div>
              ) : (
                itens.map((item) => (
                  <motion.div
                    key={item.produto.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-3 md:p-4 flex gap-3 md:gap-4 mini:p-2"
                  >
                    {/* Imagem */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 p-1 flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.produto.imagem}
                        alt={item.produto.nome}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs md:text-sm font-semibold text-white truncate">
                        {item.produto.nome}
                      </h3>
                      <p className="text-red-400 font-display font-bold text-xs md:text-sm mt-0.5">
                        {formatarPreco(item.produto.preco * item.quantidade)}
                      </p>

                      {/* Observações do item */}
                      {item.observacoes && (
                        <div className="flex items-start gap-1.5 mt-1 bg-white/5 p-1.5 rounded-lg border border-white/5">
                          <MessageSquare className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-[10px] text-gray-400 leading-tight italic line-clamp-2">
                            {item.observacoes}
                          </p>
                        </div>
                      )}

                      {/* Controles de quantidade */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              alterarQuantidade(
                                item.produto.id,
                                item.quantidade - 1,
                                item.observacoes
                              )
                            }
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-600/20 
                                       border border-white/10 flex items-center justify-center
                                       transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">
                            {item.quantidade}
                          </span>
                          <button
                            onClick={() =>
                              alterarQuantidade(
                                item.produto.id,
                                item.quantidade + 1,
                                item.observacoes
                              )
                            }
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-600/20 
                                       border border-white/10 flex items-center justify-center
                                       transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removerItem(item.produto.id, item.observacoes)}
                          className="p-1.5 rounded-lg hover:bg-red-600/20 text-gray-500 
                                     hover:text-red-400 transition-all"
                          aria-label="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer com total */}
            {itens.length > 0 && (
              <div className="border-t border-white/10 p-4 md:p-6 space-y-3 md:space-y-4 bg-black/40 backdrop-blur-xl shrink-0">
                {/* Limpar carrinho */}
                <button
                  onClick={limparCarrinho}
                  className="text-[10px] md:text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  Limpar carrinho
                </button>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-gray-400 font-medium">Total</span>
                  <span className="text-xl md:text-2xl font-display font-bold text-gradient">
                    {formatarPreco(total())}
                  </span>
                </div>

                {/* Botão finalizar */}
                <Link
                  href="/checkout"
                  onClick={fecharCarrinho}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-center py-3 md:py-4 text-sm md:text-base"
                >
                  FINALIZAR
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
