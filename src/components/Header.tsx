'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCarrinhoStore } from '@/store/cartStore'

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { toggleCarrinho, quantidadeTotal } = useCarrinhoStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '/', label: 'Início' },
    { href: '/cardapio', label: 'Cardápio' },
    { href: '/#sobre', label: 'Sobre' },
    { href: '/#contato', label: 'Contato' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-2xl shadow-2xl border-b border-white/5 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1 flex justify-start min-w-0">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group min-w-0">
              <img
                src="/logo_gangao.png"
                alt="Mega Lanche do Gangão"
                className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-full object-cover border-2 border-red-600 
                           group-hover:border-red-400 transition-all duration-300 
                           group-hover:scale-105 shadow-lg shadow-red-600/30"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <div className="flex flex-col text-left truncate">
                <h1 className="text-xs md:text-lg font-display font-bold text-white group-hover:text-red-400 transition-colors leading-none truncate">
                  Mega Lanche
                </h1>
                <p className="text-[8px] md:text-xs text-red-500 font-medium uppercase tracking-tighter">do Gangão</p>
              </div>
            </Link>
          </div>

          {/* Nav Desktop (Center) - Hidden per user request */}
          <nav className="hidden flex-[2] justify-center items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-red-400 
                           transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 
                                transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Cart + Mobile Menu (Right) */}
          <div className="flex items-center justify-end gap-2 md:gap-4 shrink-0">
            <button
              onClick={toggleCarrinho}
              className="relative p-2 md:p-2.5 rounded-xl bg-white/5 hover:bg-red-600/20 
                         border border-white/10 hover:border-red-500/50
                         transition-all duration-300 group"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
              {quantidadeTotal() > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 bg-red-600 text-[10px] 
                             font-bold rounded-full w-4 h-4 flex items-center justify-center
                             shadow-lg shadow-red-600/50"
                >
                  {quantidadeTotal()}
                </span>
              )}
            </button>

            {/* Menu Button (Desktop & Mobile) */}
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="p-2 md:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 
                         border border-white/10 transition-all group"
              aria-label="Menu"
            >
              {menuAberto ? (
                <X className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Menu className="w-4 h-4 md:w-5 md:h-5 group-hover:text-red-400 transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Floating (Desktop & Mobile) */}
      {menuAberto && (
        <div className="absolute top-24 right-4 md:right-8 w-64 bg-black/95 backdrop-blur-2xl 
                        border border-white/10 rounded-2xl shadow-2xl animate-fade-in z-50 
                        overflow-hidden ring-1 ring-white/5">
          <nav className="flex flex-col p-2 gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                className="text-gray-300 hover:text-red-400 hover:bg-white/5 
                           px-5 py-3.5 rounded-xl transition-all duration-300 font-medium 
                           flex items-center justify-between group"
              >
                {link.label}
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
