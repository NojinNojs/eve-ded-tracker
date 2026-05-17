/* ──────────────────────────────────────────────────────────
 *  EVE SSO – OAuth Callback Route Handler
 *
 *  1. Receives the authorization code from EVE SSO
 *  2. Exchanges it for an access token directly with CCP
 *  3. Verifies the token to get character info
 *  4. Signs up / signs in the user in Supabase using a
 *     deterministic email derived from CharacterID
 * ────────────────────────────────────────────────────────── */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  EVE_SSO,
  characterEmail,
  characterPassword,
  type EveCharacter,
} from '@/lib/eve-sso';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');

  // ── Handle EVE SSO error ──────────────────────────────
  if (errorParam) {
    return NextResponse.redirect(
      `${origin}?error=${encodeURIComponent(errorParam)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}?error=${encodeURIComponent('No authorization code received')}`
    );
  }

  const clientId = process.env.EVE_SSO_CLIENT_ID!;
  const clientSecret = process.env.EVE_SSO_SECRET_KEY!;
  const callbackUrl = `${origin}/auth/callback`;

  try {
    // ── Step 1: Exchange code for access token ──────────
    const tokenRes = await fetch(EVE_SSO.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: callbackUrl,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('EVE SSO token exchange failed:', errText);
      return NextResponse.redirect(
        `${origin}?error=${encodeURIComponent('Token exchange failed')}`
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken: string = tokenData.access_token;

    // ── Step 2: Verify token → get character info ───────
    const verifyRes = await fetch(EVE_SSO.VERIFY, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!verifyRes.ok) {
      console.error('EVE SSO verify failed:', await verifyRes.text());
      return NextResponse.redirect(
        `${origin}?error=${encodeURIComponent('Character verification failed')}`
      );
    }

    const character: EveCharacter = await verifyRes.json();

    // ── Step 3: Sign up or sign in to Supabase ──────────
    const email = characterEmail(character.CharacterID);
    const password = characterPassword(character.CharacterOwnerHash);

    const supabase = await createClient();

    // Try sign in first (existing user)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // User doesn't exist yet → sign up
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            character_id: character.CharacterID,
            character_name: character.CharacterName,
            full_name: character.CharacterName,
            character_owner_hash: character.CharacterOwnerHash,
          },
        },
      });

      if (signUpError) {
        console.error('Supabase sign-up error:', signUpError.message);
        return NextResponse.redirect(
          `${origin}?error=${encodeURIComponent(signUpError.message)}`
        );
      }

      // Auto-confirm: sign in immediately after signup
      const { error: postSignInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (postSignInError) {
        console.error('Post-signup sign-in error:', postSignInError.message);
        return NextResponse.redirect(
          `${origin}?error=${encodeURIComponent('Sign-in after registration failed. Please try logging in again.')}`
        );
      }
    }

    // ── Step 4: Update user metadata with latest character info
    await supabase.auth.updateUser({
      data: {
        character_name: character.CharacterName,
        full_name: character.CharacterName,
      },
    });

    // Success → redirect to dashboard
    return NextResponse.redirect(origin);
  } catch (err) {
    console.error('EVE SSO callback error:', err);
    return NextResponse.redirect(
      `${origin}?error=${encodeURIComponent('Authentication failed')}`
    );
  }
}
