'use client'

import { useState } from 'react'
import { useAdminStore } from '@/store/adminStore'
import { formatarPreco } from '@/lib/utils'
import { Produto } from '@/data/types'
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Package,
  ImageIcon,
  Search,
  Filter,
} from 'lucide-react'

interface FormProduto {
  nome: string
  descricao: string
  preco: string
  imagem: string
  categoriaId: string
  badge: string
}

const formInicial: FormProduto = {
  nome: '',
  descricao: '',
  preco: '',
  imagem: '',
  categoriaId: '',
  badge: '',
}

export default function ProdutosAdmin() {
  const {
    produtos,
    categorias,
    carregando,
    adicionarProduto,
    editarProduto,
    excluirProduto,
  } = useAdminStore()

  const [formAberto, setFormAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState<FormProduto>(formInicial)
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas')

  const produtosFiltrados = produtos.filter(p => {
    const matchesBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        p.descricao.toLowerCase().includes(busca.toLowerCase())
    const matchesCategoria = categoriaAtiva === 'todas' || p.categoriaId === categoriaAtiva
    return matchesBusca && matchesCategoria
  })
  const [removerFundo, setRemoverFundo] = useState(true)
  const [processandoIA, setProcessandoIA] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limite de 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Imagem muito grande! O limite é 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Format = reader.result as string
      
      if (removerFundo) {
        setProcessandoIA(true)
        try {
          const res = await fetch('/api/admin/remove-bg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64Format })
          })
          
          if (res.ok) {
            const data = await res.json()
            setForm({ ...form, imagem: data.result })
          } else {
            alert('Falha ao remover fundo. Usando imagem original.')
            setForm({ ...form, imagem: base64Format })
          }
        } catch (error) {
          alert('Erro na API de IA. Usando imagem original.')
          setForm({ ...form, imagem: base64Format })
        } finally {
          setProcessandoIA(false)
        }
      } else {
        setForm({ ...form, imagem: base64Format })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dados = {
      nome: form.nome,
      descricao: form.descricao,
      preco: parseFloat(form.preco),
      imagem: form.imagem,
      categoriaId: form.categoriaId,
      badge: form.badge || null,
    }

    if (editandoId) {
      await editarProduto(editandoId, dados)
    } else {
      await adicionarProduto(dados as any)
    }

    setForm(formInicial)
    setFormAberto(false)
    setEditandoId(null)
  }

  const iniciarEdicao = (produto: Produto) => {
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      imagem: produto.imagem,
      categoriaId: produto.categoriaId,
      badge: produto.badge || '',
    })
    setEditandoId(produto.id)
    setFormAberto(true)
  }

  const categoriaNome = (categoriaId: string): string => {
    const cat = categorias.find((c) => c.id === categoriaId)
    return cat ? cat.label : 'Sem categoria'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Gestão de Produtos</h1>
          <p className="text-gray-500 text-sm">Adicione, edite ou remova itens do seu cardápio</p>
        </div>
        <button
          onClick={() => {
            setForm(formInicial)
            setEditandoId(null)
            setFormAberto(true)
          }}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-red-500/50 outline-none transition-all"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Categorias (Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <button
            onClick={() => setCategoriaAtiva('todas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
              categoriaAtiva === 'todas'
                ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20'
                : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:text-gray-300'
            }`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                categoriaAtiva === cat.id
                  ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20'
                  : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:text-gray-300'
              }`}
            >
              {cat.icone} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Formulário (modal) */}
      {formAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-marca-pretoClaro border border-white/10 shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-display font-bold text-white">
                {editandoId ? '🛠️ Editar Produto' : '🍔 Novo Produto'}
              </h2>
              <button
                onClick={() => {
                  setFormAberto(false)
                  setEditandoId(null)
                }}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar relative">
              {processandoIA && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-4" />
                  <p className="text-white font-bold font-display">IA trabalhando...</p>
                  <p className="text-gray-400 text-xs mt-1">Removendo o fundo da imagem</p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nome do produto</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-500/50 outline-none"
                    placeholder="Ex: Gangão Turbinado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Descrição</label>
                  <textarea
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    required
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-500/50 outline-none resize-none"
                    placeholder="Descreva os ingredientes..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.preco}
                      onChange={(e) => setForm({ ...form, preco: e.target.value })}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Badge</label>
                    <input
                      type="text"
                      value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-500/50 outline-none"
                      placeholder="Ex: Novo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Categoria</label>
                  <select
                    value={form.categoriaId}
                    onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-500/50 outline-none appearance-none"
                  >
                    <option value="">Selecione...</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-marca-preto">
                        {cat.icone} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Switch de IA para fundo */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <h3 className="text-sm font-medium text-white">Remover Fundo (IA)</h3>
                    <p className="text-xs text-gray-500">Recorta o produto automaticamente usando IA.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRemoverFundo(!removerFundo)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${
                      removerFundo ? 'bg-red-600' : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 mx-1 ${
                        removerFundo ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Imagem do Produto</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                        {form.imagem ? (
                          <>
                            <img src={form.imagem} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setForm({ ...form, imagem: '' })}
                                className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-red-500/50 transition-all group">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Plus className="w-6 h-6 text-gray-500 group-hover:text-red-500 mb-2 transition-colors" />
                            <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors font-bold">
                              {form.imagem ? 'Trocar Imagem' : 'Selecionar da Galeria'}
                            </p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="text-[10px] text-gray-600 text-center font-bold uppercase tracking-widest">
                          PNG, JPG ou WEBP (Máx. 2MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
                >
                  <Save className="w-5 h-5" />
                  {editandoId ? 'Atualizar Produto' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela de produtos (Desktop) */}
      <div className="hidden md:block glass-card overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Produto</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Preço</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 hidden sm:table-cell text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 group-hover:border-red-500/30 transition-colors">
                        <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{produto.nome}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{produto.descricao}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {categoriaNome(produto.categoriaId)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-display font-bold text-red-500">{formatarPreco(produto.preco)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => iniciarEdicao(produto)}
                        className="p-2 bg-white/5 border border-white/10 rounded-xl text-blue-400 hover:bg-blue-400/10 transition-all"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Deseja realmente excluir este produto?')) {
                            await excluirProduto(produto.id)
                          }
                        }}
                        className="p-2 bg-white/5 border border-white/10 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid de Cards (Mobile) */}
      <div className="md:hidden space-y-4">
        {produtosFiltrados.map((produto) => (
          <div key={produto.id} className="glass-card p-4 border border-white/5 space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white text-lg truncate">{produto.nome}</h3>
                  <span className="font-display font-black text-red-500 shrink-0">
                    {formatarPreco(produto.preco)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{produto.descricao}</p>
                <div className="mt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-400 px-2 py-1 rounded-lg border border-white/5">
                    {categoriaNome(produto.categoriaId)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => iniciarEdicao(produto)}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-blue-400 font-bold text-sm"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={async () => {
                  if (confirm('Deseja realmente excluir este produto?')) {
                    await excluirProduto(produto.id)
                  }
                }}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-red-500 font-bold text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
