'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, LogIn, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function AdminLogin() {
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/admin' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-marca-preto relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 border border-white/10 relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shadow-lg shadow-red-600/20 mb-6 group hover:rotate-6 transition-transform">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Gangão Admin</h1>
          <p className="text-gray-400 text-sm">Acesso exclusivo para administradores</p>
        </div>

        <div className="space-y-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-16 rounded-2xl bg-white text-black flex items-center justify-center gap-4 font-bold hover:bg-gray-100 transition-all active:scale-[0.98] shadow-xl shadow-white/5"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
            Entrar com Google
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-4 text-gray-400 hover:text-white transition-colors text-sm font-medium border border-transparent hover:border-white/5 rounded-2xl hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Loja
          </Link>
        </div>

        <p className="mt-12 text-center text-xs text-gray-500">
          &copy; Mega Lanche do Gangão.
        </p>
      </motion.div>
    </div>
  )
}
