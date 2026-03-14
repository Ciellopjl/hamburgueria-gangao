'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ListTree, 
  Clock, 
  Settings, 
  LogOut,
  ChevronRight,
  X,
  Store,
  Ticket
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pedidos', label: 'Pedidos', icon: Clock },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/categorias', label: 'Categorias', icon: ListTree },
  { href: '/admin/cupons', label: 'Cupons', icon: Ticket },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay para Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-black border-r border-white/10 z-[160] transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo_gangao.png"
              alt="Logo"
              className="h-10 w-10 rounded-full border border-red-600/50 group-hover:border-red-500 transition-colors"
            />
            <div>
              <h1 className="text-sm font-display font-bold text-white">Gangão Admin</h1>
              <p className="text-[10px] text-red-500 font-medium uppercase tracking-tighter">Gerencial</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 lg:hidden text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose()
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                  active
                    ? 'bg-red-600/10 text-red-500 border border-red-600/20 shadow-lg shadow-red-600/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 ${
                      active ? 'text-red-500' : 'group-hover:text-red-400 transition-colors'
                    }`}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {active && (
                  <motion.div layoutId="active-nav" className="text-red-500">
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium group"
          >
            <Store className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            Voltar para Loja
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sair do Admin
          </button>
        </div>
      </aside>
    </>
  )
}
