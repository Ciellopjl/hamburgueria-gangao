import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: '/admin',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      
      const bossEmail = process.env.ADMIN_EMAIL || "ciellopjl023@gmail.com"
      
      // Permite o login. O controle de acesso granular de admin vs boss é feito
      // via verificação de role/sessão dentro do painel.
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = session.user.email === (process.env.ADMIN_EMAIL || "ciellopjl023@gmail.com") ? "BOSS" : "ADMIN"
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
