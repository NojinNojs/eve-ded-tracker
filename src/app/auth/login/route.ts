/* ──────────────────────────────────────────────────────────
 *  EVE SSO – Login Route Handler
 *
 *  Redirects directly to CCP's EVE SSO authorization page.
 *  No Supabase provider needed — we handle the flow manually.
 * ────────────────────────────────────────────────────────── */

import { NextResponse } from 'next/server';
import { EVE_SSO } from '@/lib/eve-sso';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  const clientId = process.env.EVE_SSO_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      `${origin}?error=${encodeURIComponent('EVE_SSO_CLIENT_ID not configured')}`
    );
  }

  const callbackUrl = process.env.EVE_SSO_CALLBACK_URL ?? `${origin}/auth/callback`;

  // Build EVE SSO authorize URL with required params
  const params = new URLSearchParams({
    response_type: 'code',
    redirect_uri: callbackUrl,
    client_id: clientId,
    scope: 'publicData',
    state: crypto.randomUUID(), // CSRF protection
  });

  const authorizeUrl = `${EVE_SSO.AUTHORIZE}?${params.toString()}`;

  return NextResponse.redirect(authorizeUrl);
}
