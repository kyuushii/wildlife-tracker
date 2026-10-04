export const AUTH_COOKIE_NAME = 'wildlife_tracker_auth';

export function getSitePassword(): string {
  // Configured via Vercel Environment Variables: SITE_PASSWORD
  return process.env.SITE_PASSWORD || 'wildlife';
}

export function getAuthSecret(): string {
  return process.env.AUTH_SECRET || 'wildlife-photographer-salt-2025';
}

/**
 * Creates a deterministic SHA-256 token based on the site password and secret.
 * Uses Web Crypto API compatible with Edge runtime and Node.js.
 */
export async function createAuthToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}:${getAuthSecret()}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies if the provided cookie token matches the hashed master password.
 */
export async function verifyAuthToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const expectedToken = await createAuthToken(getSitePassword());
    return token === expectedToken;
  } catch {
    return false;
  }
}
