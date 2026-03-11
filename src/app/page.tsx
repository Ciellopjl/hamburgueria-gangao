'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import SobreSection from '@/components/SobreSection'
import MenuSection from '@/components/MenuSection'
import PromocoesSection from '@/components/PromocoesSection'
import FooterSection from '@/components/FooterSection'
import CartSidebar from '@/components/CartSidebar'
import { Promocao } from '@/data/types'

export default function HomePage() {
  const [promocoes, setPromocoes] = useState<Promocao[]>([])

  useEffect(() => {
    async function carregarPromocoes() {
      try {
        const res = await fetch('/api/promocoes')
        if (res.ok) {
          const data = await res.json()
          setPromocoes(data)
        }
      } catch (erro) {
        console.error('Erro ao carregar promoções:', erro)
      }
    }
    carregarPromocoes()
  }, [])

  return (
    <>
      <Header />
      <CartSidebar />
      <main>
        <HeroSection />
        <SobreSection />
        <MenuSection />
        <PromocoesSection promocoes={promocoes} />
      </main>
      <FooterSection />
    </>
  )
}
