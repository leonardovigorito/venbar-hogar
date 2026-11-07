const COOKIE = "venbar_admin";
const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getKey() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

export async function createSessionToken(): Promise<string> {
  const key = await getKey();
  const payloadB64 = toBase64Url(encoder.encode(`admin.${Date.now()}`));
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  return `${payloadB64}.${toBase64Url(new Uint8Array(sig))}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return false;

  const key = await getKey();
  const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const expectedB64 = toBase64Url(new Uint8Array(expectedSig));

  if (expectedB64.length !== sigB64.length) return false;
  let diff = 0;
  for (let i = 0; i < expectedB64.length; i++) {
    diff |= expectedB64.charCodeAt(i) ^ sigB64.charCodeAt(i);
  }
  return diff === 0;
}

export const ADMIN_COOKIE = COOKIE;
