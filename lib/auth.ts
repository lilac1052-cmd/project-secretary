import crypto from "crypto";

export const SESSION_COOKIE_NAME = "session";

function getSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) throw new Error("AUTH_SESSION_SECRET가 설정되지 않았습니다.");
  return secret;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function checkCredentials(username: string, password: string): boolean {
  const validUsername = process.env.AUTH_USERNAME || "";
  const validPassword = process.env.AUTH_PASSWORD || "";
  if (!validUsername || !validPassword) return false;
  return (
    timingSafeEqualStr(username, validUsername) &&
    timingSafeEqualStr(password, validPassword)
  );
}

export function signSession(username: string): string {
  const sig = crypto.createHmac("sha256", getSecret()).update(username).digest("hex");
  return `${username}.${sig}`;
}

export function verifySessionValue(value: string | undefined): boolean {
  if (!value) return false;
  const idx = value.lastIndexOf(".");
  if (idx === -1) return false;

  const username = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  const validUsername = process.env.AUTH_USERNAME || "";
  if (!validUsername || username !== validUsername) return false;

  const expectedSig = crypto.createHmac("sha256", getSecret()).update(username).digest("hex");
  if (sig.length !== expectedSig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
}
