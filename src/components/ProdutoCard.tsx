'use client'

import { motion } from 'framer-motion'
import { Plus, ImageOff, X, MessageSquare, ShoppingCart } from 'lucide-react'
import { Produto } from '@/data/types'
import { formatarPreco } from '@/lib/utils'
import { useCarrinhoStore } from '@/store/cartStore'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

interface ProdutoCardProps {
  produto: Produto
  index?: number
}

export default function ProdutoCard({ produto, index = 0 }: ProdutoCardProps) {
  const { adicionarItem } = useCarrinhoStore()
  const [imagemErro, setImagemErro] = useState(false)
  const [adicionado, setAdicionado] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [observacoes, setObservacoes] = useState('')

  const handleConfirmar = () => {
    adicionarItem(produto, observacoes)
    setAdicionado(true)
    setModalAberto(false)
    setObservacoes('')
    setTimeout(() => setAdicionado(false), 1000)
  }

  const handleAdicionar = () => {
    // Se for bebida (ou se não tiver categoria e assumirmos que não precisa de modal)
    // Aqui usaremos o ID ou Nome se disponível. Como temos o objeto produto,
    // vamos assumir que se não for bebida ele abre o modal.
    
    // Verificando se o nome da categoria existe e é 'bebidas'
    // Se não tivermos o objeto categoria carregado, poderíamos usar o ID, 
    // mas no nosso seed 'bebidas' é o nome fixo.
    if (produto.categoria?.nome === 'bebidas' || produto.categoriaId === 'bebidas') {
      adicionarItem(produto)
      setAdicionado(true)
      setTimeout(() => setAdicionado(false), 1000)
    } else {
      setModalAberto(true)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="glass-card overflow-hidden group card-hover"
      >
        {/* Imagem */}
        <div className="relative h-48 overflow-hidden bg-marca-cinzaEscuro">
          {!imagemErro ? (
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-full object-contain object-center p-2 transition-transform duration-500 
                         group-hover:scale-110"
              onError={() => setImagemErro(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
              <ImageOff className="w-12 h-12 mb-2" />
              <span className="text-xs">Sem imagem</span>
            </div>
          )}

          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badge */}
          {produto.badge && (
            <span
              className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold 
                         px-3 py-1 rounded-full shadow-lg"
            >
              {produto.badge}
            </span>
          )}

          {/* Preço sobre a imagem */}
          <div className="absolute bottom-3 right-3">
            <span
              className="bg-black/80 backdrop-blur-sm text-red-400 font-display font-bold 
                         text-lg px-3 py-1 rounded-lg border border-red-600/30"
            >
              {formatarPreco(produto.preco)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 md:p-5">
          <h3 className="text-base md:text-lg font-display font-semibold text-white mb-1 md:mb-2 
                         group-hover:text-red-400 transition-colors line-clamp-1">
            {produto.nome}
          </h3>
          <p className="text-gray-400 text-[10px] md:text-sm leading-tight md:leading-relaxed mb-3 md:mb-4 line-clamp-2">
            {produto.descricao}
          </p>

          {/* Botão adicionar */}
          <button
            onClick={handleAdicionar}
            disabled={!produto.disponivel}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl 
                       font-semibold text-sm transition-all duration-300
                       ${
                         adicionado
                           ? 'bg-green-600 text-white'
                           : produto.disponivel
                           ? 'btn-primary'
                           : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                       }`}
          >
            {adicionado ? (
              '✅ Adicionado!'
            ) : produto.disponivel ? (
              <>
                <Plus className="w-4 h-4" />
                Adicionar
              </>
            ) : (
              'Indisponível'
            )}
          </button>
        </div>
      </motion.div>

      {/* Modal de Customização */}
      <AnimatePresence>
        {modalAberto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalAberto(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-marca-pretoClaro border border-white/10 
                         rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/5">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-600/10 flex items-center justify-center text-red-500">
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm md:text-lg font-bold text-white truncate">Personalizar</h2>
                    <p className="text-[8px] md:text-xs text-gray-500 uppercase tracking-widest truncate">{produto.nome}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setModalAberto(false)}
                  className="p-1.5 md:p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Corpo Modal */}
              <div className="p-6 space-y-6">
                <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-20 h-20 rounded-xl bg-white/5 p-1 flex items-center justify-center flex-shrink-0">
                    <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{produto.nome}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{produto.descricao}</p>
                    <p className="text-red-500 font-display font-black text-lg mt-2">{formatarPreco(produto.preco)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4 text-red-500" />
                    Ingredientes / Observações
                  </label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex: Sem cebola, trocar queijo por cheddar, retirar bacon..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white 
                               placeholder-gray-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 
                               outline-none transition-all resize-none text-sm"
                  />
                  <p className="text-[10px] text-gray-600 italic">
                    Digite aqui qualquer alteração nos ingredientes ou observações do pedido.
                  </p>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="p-6 bg-black/20 border-t border-white/5">
                <button
                  onClick={handleConfirmar}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Confirmar e Adicionar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
