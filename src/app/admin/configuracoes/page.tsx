'use client'

import { useState } from 'react'
import { 
  Save, 
  MapPin, 
  Phone, 
  Clock, 
  DollarSign,
  ShieldCheck,
  Bell,
  UtensilsCrossed,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function ConfiguracoesAdmin() {
  const [salvando, setSalvando] = useState(false)
  
  const handleSave = () => {
    setSalvando(true)
    setTimeout(() => {
      setSalvando(false)
      alert('Configurações salvas com sucesso (Simulação)')
    }, 1000)
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Configurações da Loja</h1>
        <p className="text-gray-500 text-sm">Gerencie os dados públicos e operacionais do Gangão</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dados da Loja */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2 bg-red-600/10 rounded-lg text-red-500">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Perfil da Unidade</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome da Loja</label>
              <input 
                type="text" 
                defaultValue="Mega Lanche do Gangão"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-red-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">WhatsApp para Pedidos</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input 
                  type="text" 
                  defaultValue="(82) 9 8865-2775"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-red-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Endereço Completo</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input 
                  type="text" 
                  defaultValue="Batalha - AL, Centro"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-red-500/50"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Operação e Entrega */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2 bg-blue-600/10 rounded-lg text-blue-500">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Operação</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Abertura</label>
              <input 
                type="time" 
                defaultValue="18:00"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-red-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fechamento</label>
              <input 
                type="time" 
                defaultValue="23:00"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-red-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Taxa de Entrega Padrão (R$)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="number" 
                defaultValue="5.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-red-500/50"
              />
            </div>
          </div>

          <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
            <p className="text-[10px] text-orange-200/60 leading-relaxed uppercase tracking-wider font-bold">
              Esses dados são exibidos no rodapé e usados no cálculo do checkout automatizado.
            </p>
          </div>
        </motion.div>

        {/* Segurança */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8 border-l-4 border-green-600 lg:col-span-2 flex flex-col items-stretch md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-600/10 rounded-2xl text-green-500 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg md:text-xl">Acesso Master</h3>
              <p className="text-gray-500 text-sm">Logado como administrador proprietário.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest shrink-0">
              Alterar Senha
            </button>
            <button 
              onClick={handleSave}
              disabled={salvando}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              {salvando ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-center gap-2 text-gray-700 text-[10px] font-black uppercase tracking-[0.2em]">
        <Bell className="w-3 h-3" />
        Sistema Gangão Admin v2.0 • Senior Edition
      </div>
    </div>
  )
}
