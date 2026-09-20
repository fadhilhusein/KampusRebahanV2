import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = ["/dashboard", "/order"].some((p) =>
        nextUrl.pathname.startsWith(p)
      );
      if (isProtected && !isLoggedIn) return false;
      return true;
    },
  },
  providers: [],
};
