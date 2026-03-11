'use client'

import { useState } from 'react'
import { useCarrinhoStore } from '@/store/cartStore'
import { formatarPreco, gerarMensagemWhatsApp, gerarUrlWhatsApp } from '@/lib/utils'
import Header from '@/components/Header'
import CartSidebar from '@/components/CartSidebar'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Building,
  CreditCard,
  DollarSign,
  QrCode,
  Send,
  ShoppingBag,
  MessageCircle,
  Ticket,
  Tag,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function CheckoutPage() {
  const { itens, total, limparCarrinho } = useCarrinhoStore()

  const [formData, setFormData] = useState({
    nomeCliente: '',
    telefone: '',
    endereco: '',
    bairro: '',
    formaPagamento: '' as 'pix' | 'dinheiro' | 'cartao' | '',
    trocoParaValor: '',
    observacoes: '',
  })

  const [enviando, setEnviando] = useState(false)
  
  // Estados do Cupom
  const [cupomCodigo, setCupomCodigo] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState<any>(null)
  const [validandoCupom, setValidandoCupom] = useState(false)
  const [erroCupom, setErroCupom] = useState('')

  const handleValidarCupom = async () => {
    if (!cupomCodigo) return
    
    setValidandoCupom(true)
    setErroCupom('')
    
    try {
      const res = await fetch('/api/cupons/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo: cupomCodigo,
          totalPedido: total()
        })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setCupomAplicado(data.cupom)
      } else {
        setErroCupom(data.erro)
      }
    } catch (erro) {
      setErroCupom('Erro ao validar cupom')
    } finally {
      setValidandoCupom(false)
    }
  }

  const handleRemoverCupom = () => {
    setCupomAplicado(null)
    setCupomCodigo('')
    setErroCupom('')
  }

  const calcularTotalFinal = () => {
    const subtotal = total()
    if (!cupomAplicado) return subtotal
    return Math.max(0, subtotal - cupomAplicado.descontoAplicado)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const formValido =
    formData.nomeCliente.trim() &&
    formData.telefone.trim() &&
    formData.endereco.trim() &&
    formData.bairro.trim() &&
    formData.formaPagamento &&
    itens.length > 0

  const handleEnviarPedido = async () => {
    if (!formValido) return

    setEnviando(true)

    try {
      // Salvar pedido na API
      await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          itens: itens.map((item) => ({
            produtoId: item.produto.id,
            nome: item.produto.nome,
            quantidade: item.quantidade,
            preco: item.produto.preco,
            observacoes: item.observacoes || null,
          })),
          total: total(),
          cupomCodigo: cupomAplicado?.codigo || null,
          desconto: cupomAplicado?.descontoAplicado || 0,
          totalFinal: calcularTotalFinal(),
        }),
      })
    } catch (erro) {
      console.error('Erro ao salvar pedido:', erro)
    }

    // Gerar mensagem WhatsApp
    const mensagem = gerarMensagemWhatsApp({
      nomeCliente: formData.nomeCliente,
      telefone: formData.telefone,
      endereco: formData.endereco,
      bairro: formData.bairro,
      formaPagamento: formData.formaPagamento,
      trocoParaValor: formData.trocoParaValor || undefined,
      observacoes: formData.observacoes || undefined,
      itens: itens.map((item) => ({
        nome: item.produto.nome,
        quantidade: item.quantidade,
        preco: item.produto.preco,
        observacoes: item.observacoes,
      })),
      total: total(),
      desconto: cupomAplicado?.descontoAplicado || 0,
      totalFinal: calcularTotalFinal(),
    })

    const numeroWhatsApp =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMERO || '5582999999999'
    const url = gerarUrlWhatsApp(numeroWhatsApp, mensagem)

    // Abrir WhatsApp
    window.open(url, '_blank')

    // Limpar carrinho
    limparCarrinho()
    setEnviando(false)
  }

  const formasPagamento = [
    { valor: 'pix', label: 'PIX', icone: <QrCode className="w-5 h-5" /> },
    {
      valor: 'dinheiro',
      label: 'Dinheiro',
      icone: <DollarSign className="w-5 h-5" />,
    },
    {
      valor: 'cartao',
      label: 'Cartão',
      icone: <CreditCard className="w-5 h-5" />,
    },
  ]

  // Se carrinho está vazio
  if (itens.length === 0) {
    return (
      <>
        <Header />
        <CartSidebar />
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="w-20 h-20 text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl font-display font-bold mb-3">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-500 mb-8">
              Adicione itens do cardápio para fazer seu pedido
            </p>
            <Link href="/cardapio" className="btn-primary">
              Ver Cardápio
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <CartSidebar />
      <main className="min-h-screen pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Link
              href="/cardapio"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 
                         transition-colors text-[10px] md:text-sm mb-2 md:mb-4"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              Voltar
            </Link>
            <h1 className="text-2xl md:text-4xl font-display font-bold leading-tight">
              Finalizar <span className="text-gradient">Pedido</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dados pessoais */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-red-500" />
                  Dados para Entrega
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      Nome completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="nomeCliente"
                        value={formData.nomeCliente}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4
                                   text-white placeholder-gray-600 focus:border-red-500/50 
                                   focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      Telefone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(82) 9 9999-9999"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4
                                   text-white placeholder-gray-600 focus:border-red-500/50 
                                   focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      Endereço (Rua e Número) *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        placeholder="Rua, número"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4
                                   text-white placeholder-gray-600 focus:border-red-500/50 
                                   focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      Bairro *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        placeholder="Bairro"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4
                                   text-white placeholder-gray-600 focus:border-red-500/50 
                                   focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Observações (opcional)
                  </label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    placeholder="Ex: sem cebola, ponto da carne, etc."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4
                               text-white placeholder-gray-600 focus:border-red-500/50 
                               focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all
                               resize-none"
                  />
                </div>
              </div>

              {/* Forma de pagamento */}
              <div className="glass-card p-4 md:p-6">
                <h2 className="text-sm md:text-lg font-display font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                  Pagamento
                </h2>

                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {formasPagamento.map((forma) => (
                    <button
                      key={forma.valor}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          formaPagamento: forma.valor as 'pix' | 'dinheiro' | 'cartao',
                        })
                      }
                      className={`flex flex-col items-center gap-1.5 p-2 md:p-4 rounded-xl border 
                                 transition-all duration-300
                                 ${
                                   formData.formaPagamento === forma.valor
                                     ? 'bg-red-600/20 border-red-500 text-red-400'
                                     : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                                 }`}
                    >
                      <div className="shrink-0">{forma.icone}</div>
                      <span className="text-[10px] md:text-xs font-medium truncate w-full text-center">{forma.label}</span>
                    </button>
                  ))}
                </div>

                {/* Troco para (quando dinheiro) */}
                {formData.formaPagamento === 'dinheiro' && (
                  <div className="mt-4">
                    <label className="block text-sm text-gray-400 mb-1.5">
                      Troco para quanto?
                    </label>
                    <input
                      type="text"
                      name="trocoParaValor"
                      value={formData.trocoParaValor}
                      onChange={handleChange}
                      placeholder="Ex: 50,00"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4
                                 text-white placeholder-gray-600 focus:border-red-500/50 
                                 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Resumo do pedido */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-28">
                <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                  Resumo do Pedido
                </h2>

                {/* Itens */}
                <div className="space-y-3 mb-6">
                  {itens.map((item) => (
                    <div
                      key={item.produto.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-300">
                        {item.quantidade}x {item.produto.nome}
                      </span>
                      <span className="text-gray-400">
                        {formatarPreco(item.produto.preco * item.quantidade)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-4 mb-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-200 font-medium">
                      {formatarPreco(total())}
                    </span>
                  </div>

                  {cupomAplicado && (
                    <div className="flex items-center justify-between text-sm text-green-500">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Desconto ({cupomAplicado.codigo})
                      </span>
                      <span>-{formatarPreco(cupomAplicado.descontoAplicado)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs md:text-gray-200 font-bold">Total</span>
                    <span className="text-xl md:text-2xl font-display font-bold text-gradient">
                      {formatarPreco(calcularTotalFinal())}
                    </span>
                  </div>
                </div>

                {/* Cupom de Desconto */}
                <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-bold text-white uppercase tracking-tighter">Cupom de Desconto</span>
                  </div>

                  {cupomAplicado ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 p-2 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-bold text-green-500">{cupomAplicado.codigo}</span>
                      </div>
                      <button 
                        onClick={handleRemoverCupom}
                        className="p-1 hover:bg-green-500/20 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-green-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Código do cupom"
                          value={cupomCodigo}
                          onChange={(e) => setCupomCodigo(e.target.value.toUpperCase())}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-red-500 transition-all font-mono"
                        />
                        <button
                          onClick={handleValidarCupom}
                          disabled={!cupomCodigo || validandoCupom}
                          className="bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          {validandoCupom ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'APLICAR'}
                        </button>
                      </div>
                      {erroCupom && (
                        <p className="text-[10px] text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {erroCupom}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <img
                    src="/logo_gangao.png"
                    alt="Mega Lanche do Gangão"
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-600/50 opacity-50"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>

                {/* Botão enviar */}
                <button
                  onClick={handleEnviarPedido}
                  disabled={!formValido || enviando}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl 
                             font-bold text-base transition-all duration-300
                             ${
                               formValido && !enviando
                                 ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30 hover:shadow-green-500/40'
                                 : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                             }`}
                >
                  {enviando ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      ENVIAR PEDIDO PARA WHATSAPP
                    </>
                  )}
                </button>

                {!formValido && itens.length > 0 && (
                  <p className="text-xs text-gray-600 text-center mt-3">
                    Preencha todos os campos obrigatórios
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
