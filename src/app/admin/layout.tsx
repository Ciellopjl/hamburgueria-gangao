'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAdminStore } from '@/store/adminStore'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminLogin from '@/components/admin/AdminLogin'
import { Menu } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { carregarDados } = useAdminStore()
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (session) {
      carregarDados()
      
      const interval = setInterval(() => {
        carregarDados()
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [carregarDados, session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-marca-preto flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <AdminLogin />
  }

  return (
    <div className="min-h-screen bg-marca-preto flex flex-col lg:flex-row">
      {/* Header Mobile */}
      <header className="lg:hidden h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <img src="/logo_gangao.png" alt="Logo" className="h-8 w-8 rounded-full border border-red-600/50" />
          <span className="text-sm font-display font-bold text-white tracking-tight">Gangão Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
