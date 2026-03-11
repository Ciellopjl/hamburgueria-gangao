'use client'

import { useState } from 'react'
import { useAdminStore } from '@/store/adminStore'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X,
  Tag,
  Smile,
  Type
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function CategoriasAdmin() {
  const { categorias, adicionarCategoria, editarCategoria, excluirCategoria, carregando } = useAdminStore()
  const [formAberto, setFormAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState({ nome: '', label: '', icone: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editandoId) {
      await editarCategoria(editandoId, form)
    } else {
      await adicionarCategoria(form)
    }
    setForm({ nome: '', label: '', icone: '' })
    setFormAberto(false)
    setEditandoId(null)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Categorias</h1>
          <p className="text-gray-500 text-sm">Organize seu cardápio em seções</p>
        </div>
        <button 
          onClick={() => {
            setForm({ nome: '', label: '', icone: '' })
            setEditandoId(null)
            setFormAberto(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {categorias.map((cat) => (
          <motion.div 
            layout
            key={cat.id}
            className="glass-card p-6 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5">
                {cat.icone}
              </div>
              <div>
                <h3 className="text-white font-bold">{cat.label}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{cat.nome}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setForm({ nome: cat.nome, label: cat.label, icone: cat.icone })
                  setEditandoId(cat.id)
                  setFormAberto(true)
                }}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  if (confirm('Excluir categoria? Isso pode afetar produtos vinculados.')) {
                    excluirCategoria(cat.id)
                  }
                }}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {formAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="bg-marca-pretoClaro border border-white/10 rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{editandoId ? 'Editar' : 'Nova'} Categoria</h2>
              <button onClick={() => setFormAberto(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome (Slug)</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-red-500/50"
                    placeholder="ex: burguers-artesanais"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rótulo (Exibição)</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="text"
                    required
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-red-500/50"
                    placeholder="ex: Hambúrgueres"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ícone (Emoji)</label>
                <div className="relative">
                  <Smile className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="text"
                    required
                    value={form.icone}
                    onChange={(e) => setForm({ ...form, icone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-red-500/50"
                    placeholder="ex: 🍔"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={carregando}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvar Categoria
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
