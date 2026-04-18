import type { AppUser } from './types';

const STRAPI_URL = import.meta.env.STRAPI_URL;
const JWT_SECRET = import.meta.env.APP_JWT_SECRET;

function b64url(obj: object): string {
  return btoa(JSON.stringify(obj))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function hmacVerify(data: string, sig: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  );
  const sigBytes = Uint8Array.from(
    atob(sig.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)
  );
  return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
}

async function signJWT(payload: object, expiresInHours = 8): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now    = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: now, exp: now + expiresInHours * 3600 };
  const data   = `${b64url(header)}.${b64url(claims)}`;
  const sig    = await hmacSign(data, JWT_SECRET);
  return `${data}.${sig}`;
}

async function verifyJWT(token: string): Promise<Record<string, any> | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const valid = await hmacVerify(`${h}.${p}`, s, JWT_SECRET);
    if (!valid) return null;
    const payload = JSON.parse(atob(p.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

const ROLE_MAP: Record<string, AppUser['role']> = {
  'super_admin':      'super_admin',
  'Super Admin':      'super_admin',
  'operations_admin': 'operations_admin',
  'Operations Admin': 'operations_admin',
  'Authenticated':    'operations_admin',
  'staff':            'staff',
  'guide':            'guide',
  'Guide':            'guide',
};

export async function loginWithStrapi(
  identifier: string,
  password: string
): Promise<{ user: AppUser; sessionToken: string } | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.jwt || !data.user) return null;

    const user: AppUser = {
      id:          data.user.id,
      email:       data.user.email,
      username:    data.user.username,
      role:        ROLE_MAP[data.user.role?.name ?? 'Authenticated'] ?? 'operations_admin',
      strapiToken: data.jwt,
    };

    const sessionToken = await signJWT(user);
    return { user, sessionToken };
  } catch (err) {
    console.error('[auth] login error:', err);
    return null;
  }
}

export async function verifySessionToken(token: string): Promise<AppUser | null> {
  const payload = await verifyJWT(token);
  if (!payload) return null;
  return {
    id:          payload.id,
    email:       payload.email,
    username:    payload.username,
    role:        payload.role,
    strapiToken: payload.strapiToken,
  };
}
