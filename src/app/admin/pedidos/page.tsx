'use client'

import { useAdminStore } from '@/store/adminStore'
import { formatarPreco } from '@/lib/utils'
import { 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  Eye,
  MoreVertical,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  Trash2
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PedidosAdmin() {
  const { pedidos, atualizarStatusPedido, carregando } = useAdminStore()
  const [pedidoSelecionado, setPedidoSelecionado] = useState<any>(null)
  const [filtroStatus, setFiltroStatus] = useState('todos')

  const statusMap = {
    pendente: { label: 'Pendente', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: Clock },
    preparando: { label: 'Preparando', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Clock },
    entregando: { label: 'Em Entrega', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Truck },
    entregue: { label: 'Entregue', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2 },
    cancelado: { label: 'Cancelado', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle },
  }

  const pedidosFiltrados = filtroStatus === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.status === filtroStatus)

  const handleStatusUpdate = async (id: string, novoStatus: string) => {
    await atualizarStatusPedido(id, novoStatus)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Gestão de Pedidos</h1>
          <p className="text-gray-500 text-sm">Acompanhe e atualize os pedidos da sua lanchonete</p>
        </div>
        
        {/* Filtros de Status */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {['todos', 'pendente', 'preparando', 'entregando', 'entregue'].map((s) => (
              <button
                key={s}
                onClick={() => setFiltroStatus(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  filtroStatus === s
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="md:ml-auto">
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja apagar todos os pedidos? Esta ação não pode ser desfeita.')) {
                  useAdminStore.getState().limparPedidos()
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Pedidos
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pedidosFiltrados.map((pedido) => {
          const config = (statusMap as any)[pedido.status] || statusMap.pendente
          return (
            <motion.div
              layout
              key={pedido.id}
              className="glass-card p-4 md:p-6 border border-white/5 hover:border-white/10 transition-all group relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 md:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-600">#{pedido.id.slice(0, 8)}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white">{pedido.nomeCliente}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {pedido.telefone}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(pedido.criadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {pedido.bairro}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-4 md:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                  <div className="lg:text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Total</p>
                    <p className="text-lg md:text-xl font-display font-black text-white">{formatarPreco(pedido.total)}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPedidoSelecionado(pedido)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all order-2 lg:order-none"
                      title="Ver Detalhes"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <div className="hidden lg:block h-10 w-[1px] bg-white/10 mx-2" />
                    
                    {pedido.status === 'pendente' && (
                      <button 
                        onClick={() => handleStatusUpdate(pedido.id, 'preparando')}
                        className="btn-primary text-[10px] md:text-xs !py-3 !px-4 whitespace-nowrap"
                      >
                        Iniciar Preparo
                      </button>
                    )}
                    {pedido.status === 'preparando' && (
                      <button 
                        onClick={() => handleStatusUpdate(pedido.id, 'entregando')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] md:text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-purple-600/20 whitespace-nowrap"
                      >
                        Enviar p/ Entrega
                      </button>
                    )}
                    {pedido.status === 'entregando' && (
                      <button 
                        onClick={() => handleStatusUpdate(pedido.id, 'entregue')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] md:text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-green-600/20 whitespace-nowrap"
                      >
                        Confirmar Entrega
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges de pagamento */}
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white/5 text-gray-500 px-2 py-0.5 rounded border border-white/5">
                  {pedido.formaPagamento}
                </span>
                {pedido.trocoParaValor && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-red-600/10 text-red-400 px-2 py-0.5 rounded border border-red-600/10">
                    Troco p/ {pedido.trocoParaValor}
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}

        {pedidos.length === 0 && !carregando && (
          <div className="glass-card py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-gray-700" />
            </div>
            <div>
              <p className="text-white font-bold">Sem pedidos no momento</p>
              <p className="text-gray-500 text-sm">Divulgue seu link para começar a vender!</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Pedido */}
      <AnimatePresence>
        {pedidoSelecionado && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-marca-pretoClaro border border-white/10 rounded-3xl w-full max-w-2xl my-auto"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-display font-black text-white">Detalhes do Pedido</h2>
                    <p className="text-gray-500 text-xs">#{pedidoSelecionado.id}</p>
                  </div>
                  <button 
                    onClick={() => setPedidoSelecionado(null)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Informações do Cliente */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-red-500/20 pb-2">Informações de Entrega</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Nome</p>
                        <p className="text-white font-bold">{pedidoSelecionado.nomeCliente}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Endereço</p>
                        <p className="text-white font-bold">{pedidoSelecionado.endereco}, {pedidoSelecionado.bairro}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">WhatsApp</p>
                        <p className="text-white font-bold flex items-center gap-2">
                          {pedidoSelecionado.telefone}
                          <a href={`https://wa.me/55${pedidoSelecionado.telefone.replace(/\D/g, '')}`} target="_blank" className="text-green-500 hover:text-green-400 transition-colors">
                            <Phone className="w-4 h-4" />
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes do Pagamento */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-red-500/20 pb-2">Pagamento</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Forma</p>
                        <p className="text-white font-bold uppercase">{pedidoSelecionado.formaPagamento}</p>
                      </div>
                      {pedidoSelecionado.trocoParaValor && (
                        <div>
                          <p className="text-xs text-gray-500">Troco para</p>
                          <p className="text-white font-bold">{pedidoSelecionado.trocoParaValor}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-2xl font-display font-black text-red-500">{formatarPreco(pedidoSelecionado.total)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-red-500/20 pb-2">Produtos</h4>
                  <div className="bg-black/20 rounded-2xl overflow-hidden border border-white/5">
                    {JSON.parse(pedidoSelecionado.itens).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center font-bold text-xs">{item.quantidade}x</span>
                          <span className="text-white font-medium">{item.nome}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-400">{formatarPreco(item.preco * item.quantidade)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {pedidoSelecionado.observacoes && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Observações</p>
                    <p className="text-white text-sm italic">"{pedidoSelecionado.observacoes}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
