import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/order"];

// Cookie names used by NextAuth v5 (authjs)
const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));

  if (!hasSession) {
    const signIn = new URL("/auth/signin", req.url);
    signIn.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/order/:path*"],
};
