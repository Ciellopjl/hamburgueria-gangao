import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Apenas o e-mail autorizado pode passar
      return token?.email === process.env.ADMIN_EMAIL
    },
  },
  pages: {
    signIn: "/admin",
  },
})

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/produtos",
    "/api/categorias",
    "/api/cupons",
  ],
}
