'use client'

import { useEffect, useState } from 'react'
import { Produto, Categoria } from '@/data/types'
import ProdutoCard from './ProdutoCard'
import { motion } from 'framer-motion'

export default function MenuSection() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resProdutos, resCategorias] = await Promise.all([
          fetch('/api/produtos'),
          fetch('/api/categorias'),
        ])
        const produtosData = await resProdutos.json()
        const categoriasData = await resCategorias.json()
        setProdutos(produtosData)
        setCategorias(categoriasData)
      } catch (erro) {
        console.error('Erro ao carregar cardápio:', erro)
      } finally {
        setCarregando(false)
      }
    }
    carregarDados()
  }, [])

  const produtosFiltrados =
    categoriaAtiva === 'todas'
      ? produtos
      : produtos.filter((p) => p.categoriaId === categoriaAtiva)

  return (
    <section id="cardapio" className="section-padding bg-marca-preto relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">
            Nosso menu
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-3">
            Cardápio <span className="text-gradient">Completo</span>
          </h2>
        </motion.div>

        {/* Filtro de categorias - Scroll horizontal no mobile */}
        <div className="flex flex-nowrap md:flex-wrap md:justify-center gap-3 mb-12 
                        overflow-x-auto pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <button
            onClick={() => setCategoriaAtiva('todas')}
            className={`whitespace-nowrap flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
              ${
                categoriaAtiva === 'todas'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
          >
            🍽️ Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`whitespace-nowrap flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  categoriaAtiva === cat.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
            >
              {cat.icone} {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de produtos */}
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="h-48 skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 skeleton" />
                  <div className="h-4 w-full skeleton" />
                  <div className="h-10 w-full skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtosFiltrados.map((produto, index) => (
              <ProdutoCard key={produto.id} produto={produto} index={index} />
            ))}
          </div>
        )}

        {/* Mensagem quando não há produtos */}
        {!carregando && produtosFiltrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
