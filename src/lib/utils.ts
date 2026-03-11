/**
 * Formata um valor numérico como preço em Real brasileiro.
 * Ex: 25.90 => "R$ 25,90"
 */
export function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Gera a mensagem formatada para envio via WhatsApp.
 */
export function gerarMensagemWhatsApp(pedido: {
  nomeCliente: string
  telefone: string
  endereco: string
  bairro: string
  formaPagamento: string
  trocoParaValor?: string
  observacoes?: string
  itens: Array<{
    nome: string
    quantidade: number
    preco: number
    observacoes?: string
  }>
  total: number
  desconto?: number
  totalFinal?: number
}): string {
  const itensTexto = pedido.itens
    .map(
      (item) =>
        `▸ ${item.quantidade}x ${item.nome} — ${formatarPreco(item.preco * item.quantidade)}${item.observacoes ? `\n   ┗ _Obs: ${item.observacoes}_` : ''}`
    )
    .join('\n')

  const formaPagamentoTexto: Record<string, string> = {
    pix: '💠 PIX',
    dinheiro: '💵 Dinheiro',
    cartao: '💳 Cartão',
  }

  let mensagem = `🍔 *NOVO PEDIDO — MEGA LANCHE DO GANGÃO* 🍔\n\n`
  mensagem += `👤 *Cliente:* ${pedido.nomeCliente}\n`
  mensagem += `📱 *Telefone:* ${pedido.telefone}\n`
  mensagem += `📍 *Endereço:* ${pedido.endereco}\n`
  mensagem += `🏘️ *Bairro:* ${pedido.bairro}\n\n`
  mensagem += `📋 *ITENS DO PEDIDO:*\n${itensTexto}\n\n`
  
  if (pedido.desconto && pedido.desconto > 0) {
    mensagem += `💰 *Subtotal:* ${formatarPreco(pedido.total)}\n`
    mensagem += `🎁 *Desconto:* -${formatarPreco(pedido.desconto)}\n`
    mensagem += `💵 *TOTAL: ${formatarPreco(pedido.totalFinal || (pedido.total - pedido.desconto))}*\n\n`
  } else {
    mensagem += `💰 *TOTAL: ${formatarPreco(pedido.total)}*\n\n`
  }

  mensagem += `💳 *Pagamento:* ${formaPagamentoTexto[pedido.formaPagamento] || pedido.formaPagamento}\n`

  if (pedido.formaPagamento === 'dinheiro' && pedido.trocoParaValor) {
    mensagem += `💵 *Troco para:* R$ ${pedido.trocoParaValor}\n`
  }

  if (pedido.observacoes) {
    mensagem += `\n📝 *Observações:* ${pedido.observacoes}\n`
  }

  mensagem += `\n✅ Pedido realizado pelo site Mega Lanche do Gangão`

  return mensagem
}

/**
 * Gera a URL do WhatsApp com a mensagem do pedido.
 */
export function gerarUrlWhatsApp(numero: string, mensagem: string): string {
  const mensagemCodificada = encodeURIComponent(mensagem)
  return `https://wa.me/${numero}?text=${mensagemCodificada}`
}
