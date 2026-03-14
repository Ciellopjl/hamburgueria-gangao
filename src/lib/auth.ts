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
      const allowedEmail = "ciellolisboa023@gmail.com"
      return user.email === allowedEmail
    },
    async session({ session, token }) {
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
