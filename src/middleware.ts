import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Apenas o e-mail autorizado pode passar
      return token?.email === "ciellolisboa023@gmail.com"
    },
  },
  pages: {
    signIn: "/admin",
  },
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}
