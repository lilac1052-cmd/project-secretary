import { NextRequest, NextResponse } from "next/server";
import { verifySessionValue, SESSION_COOKIE_NAME } from "@/lib/auth";

const PUBLIC_PATHS = [
  "/login",
  "/api/login",
  "/manifest.webmanifest",
  "/apple-icon.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/icon.svg",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionValue(cookie)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
