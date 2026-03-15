'use client'

import { useState, useEffect } from 'react'
import { listWhitelist, addToWhitelist, removeFromWhitelist } from '@/app/actions/whitelist'
import { UserPlus, Trash2, Mail, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'

export default function LiberacaoPage() {
  const { data: session } = useSession()
  const [emails, setEmails] = useState<any[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const BOSS_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ciellopjl023@gmail.com"
  const isBoss = session?.user?.email === BOSS_EMAIL

  useEffect(() => {
    fetchEmails()
  }, [])

  async function fetchEmails() {
    try {
      setLoading(true)
      const data = await listWhitelist()
      setEmails(data)
    } catch (err) {
      setError('Erro ao carregar lista')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail) return
    
    try {
      setActionLoading(true)
      setError('')
      await addToWhitelist(newEmail)
      setNewEmail('')
      await fetchEmails()
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar email')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleRemove(id: string) {
    if (!confirm('Tem certeza que deseja remover este acesso?')) return
    
    try {
      setActionLoading(true)
      await removeFromWhitelist(id)
      await fetchEmails()
    } catch (err: any) {
      setError('Erro ao remover email')
    } finally {
      setActionLoading(false)
    }
  }

  if (!isBoss) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="p-4 bg-red-500/10 rounded-full">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-display font-black text-white">Acesso Restrito</h1>
        <p className="text-gray-500 max-w-md">
          Apenas o proprietário principal (@boss) tem permissão para gerenciar liberação de acessos.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-black text-white tracking-tight">Liberação de Acessos</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie quem pode acessar o painel administrativo através do Google</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Adição */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <UserPlus className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-white">Novo Acesso</h2>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                  Email do Google
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="exemplo@gmail.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors uppercase placeholder:normal-case"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-500">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Conceder Acesso'}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Emails */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Usuários Autorizados</h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/5 text-gray-400 rounded-full border border-white/10">
                {emails.length + 1} Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Usuário</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Perfil</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Adicionado em</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/* Boss sempre no topo */}
                  <tr className="bg-red-500/[0.03]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {session?.user?.image ? (
                          <img 
                            src={session.user.image} 
                            alt="Foto do Perfil" 
                            className="h-8 w-8 rounded-full border border-red-600/50"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                            B
                          </div>
                        )}
                        <span className="text-sm font-semibold text-white">{BOSS_EMAIL}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full">
                        DONO
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 italic">Sistema</td>
                    <td className="px-6 py-4 text-right">
                      <ShieldCheck className="w-5 h-5 text-red-500/50 ml-auto" />
                    </td>
                  </tr>

                  {/* Outros emails */}
                  <AnimatePresence mode="popLayout">
                    {emails.map((email) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={email.id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-400 text-xs">
                              {email.email[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-white">{email.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/5 text-gray-400 border border-white/10 rounded-full">
                            Colaborador
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(email.criadoEm).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleRemove(email.id)}
                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                            title="Remover acesso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>

                  {loading && emails.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Loader2 className="w-8 h-8 text-gray-800 animate-spin mx-auto" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
