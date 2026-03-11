'use client'

import { useAdminStore } from '@/store/adminStore'
import { formatarPreco } from '@/lib/utils'
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  AlertCircle,
  Package
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminDashboard() {
  const { pedidos, produtos, carregando } = useAdminStore()

  // Stats calculations
  const totalVendas = pedidos.reduce((acc, p) => acc + p.total, 0)
  const pedidosHoje = pedidos.filter(p => {
    const data = new Date(p.criadoEm)
    const hoje = new Date()
    return data.getDate() === hoje.getDate() && 
           data.getMonth() === hoje.getMonth() && 
           data.getFullYear() === hoje.getFullYear()
  })
  const pedidosPendentes = pedidos.filter(p => p.status === 'pendente' || p.status === 'preparando')

  const stats = [
    { 
      label: 'Vendas Totais', 
      valor: formatarPreco(totalVendas), 
      sub: 'Desde o início',
      icon: DollarSign, 
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      label: 'Pedidos Hoje', 
      valor: pedidosHoje.length, 
      sub: 'Toda a operação',
      icon: ShoppingBag, 
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Em Preparo', 
      valor: pedidosPendentes.length, 
      sub: 'Cozinha ativa',
      icon: Clock, 
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    { 
      label: 'Produtos', 
      valor: produtos.length, 
      sub: 'No cardápio',
      icon: CheckCircle2, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10'
    },
  ]

  if (carregando && pedidos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Bem-vindo de volta, aqui está o resumo do seu Gangão</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-xs font-bold text-gray-400">
          <TrendingUp className="w-4 h-4 text-green-500" />
          BALANÇO EM TEMPO REAL
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-display font-black text-white mt-1">{stat.valor}</p>
            <p className="text-[10px] text-gray-600 mt-2 font-medium">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-display font-bold text-white">Pedidos Recentes</h2>
            <Link href="/admin/pedidos" className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest">Ver Todos</Link>
          </div>
          
          <div className="glass-card overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Cliente</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Total</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pedidos.slice(0, 5).map((pedido) => (
                    <tr key={pedido.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white">{pedido.nomeCliente}</span>
                          <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{pedido.telefone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          pedido.status === 'pendente' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                          pedido.status === 'entregue' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {pedido.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-display font-bold text-white">{formatarPreco(pedido.total)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-gray-500 font-mono">
                          {new Date(pedido.criadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {pedidos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <ShoppingBag className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-500 text-sm">Nenhum pedido recebido ainda.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-l-4 border-red-600">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Atenção à Cozinha
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Você tem <span className="text-white font-bold">{pedidosPendentes.length} pedidos</span> aguardando preparo ou entrega.
            </p>
            <Link href="/admin/pedidos" className="inline-block mt-4 text-xs font-black text-red-500 hover:text-red-400 uppercase tracking-widest">
              Ir para Pedidos →
            </Link>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-red-600 to-red-900 border-none relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-white font-black text-xl mb-1">Promoção Ativa?</h3>
              <p className="text-white/70 text-sm">Gerencie seus cupons e descontos diretamente no painel.</p>
              <Link href="/admin/cupons">
                <button className="mt-6 bg-white text-red-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-xl">
                  Configurar
                </button>
              </Link>
            </div>
            <Package className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
