'use client'

import Link from 'next/link'
import { MapPin, Phone, Clock, Instagram, MessageCircle, Heart } from 'lucide-react'

export default function FooterSection() {
  return (
    <footer id="contato" className="bg-black border-t border-white/10">
      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e descrição */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo_gangao.png"
                alt="Mega Lanche do Gangão"
                className="h-12 w-12 rounded-full object-cover border-2 border-red-600"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <div>
                <h3 className="text-lg font-display font-bold">Mega Lanche</h3>
                <p className="text-xs text-red-500 font-medium -mt-1">do Gangão</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              O melhor hambúrguer artesanal de Batalha - AL. Sabores únicos feitos 
              com ingredientes selecionados e muita paixão.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4 text-sm uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Início' },
                { href: '/cardapio', label: 'Cardápio' },
                { href: '/#sobre', label: 'Sobre Nós' },
                { href: '/#contato', label: 'Contato' },
                { href: '/checkout', label: 'Finalizar Pedido' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-400 text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informações */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4 text-sm uppercase tracking-wider">
              Informações
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Batalha - Alagoas, Brasil
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Seg a Dom: 18h às 23h
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  (82) 9 8865-2775
                </span>
              </li>
            </ul>
          </div>

          {/* Redes sociais */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4 text-sm uppercase tracking-wider">
              Redes Sociais
            </h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/megalanchegangao/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-red-600/20 border border-white/10 
                           hover:border-red-500/50 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              </a>
              <a
                href="https://wa.me/5582988652775"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-green-600/20 border border-white/10 
                           hover:border-green-500/50 transition-all duration-300 group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Mega Lanche do Gangão. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-red-500" /> em Batalha - AL
          </p>
          <Link 
            href="/admin" 
            className="text-gray-600 hover:text-gray-400 text-[10px] uppercase tracking-widest transition-colors"
          >
            Entrar como admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
