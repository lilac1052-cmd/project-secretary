import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, signSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = body?.username;
  const password = body?.password;

  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    !checkCredentials(username, password)
  ) {
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, signSession(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
