import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const adminPassword = process.env.ADMIN_PASSWORD || '291108'

    if (password.trim() === adminPassword.trim()) {
      // Em um app real, usaríamos um JWT ou similar. 
      // Para este MVP, usaremos um cookie simples de sessão.
      const response = NextResponse.json({ success: true })
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        path: '/',
      })
      return response
    }

    return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 })
  }
}
