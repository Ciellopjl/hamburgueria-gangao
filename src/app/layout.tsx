import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mega Lanche do Gangão | O Melhor Hambúrguer de Batalha - AL',
  description:
    'Peça online os melhores hambúrgueres artesanais e na brasa de Batalha, Alagoas. Mega Lanche do Gangão - Sabor que conquista!',
  keywords: [
    'hambúrguer',
    'lanchonete',
    'Batalha',
    'Alagoas',
    'delivery',
    'artesanal',
    'brasa',
  ],
  icons: {
    icon: '/logo_gangao.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-marca-preto text-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
