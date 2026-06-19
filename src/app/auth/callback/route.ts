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
  const callbackUrl = process.env.EVE_SSO_CALLBACK_URL ?? `${origin}/auth/callback`;



  try {
    // ── Step 1: Exchange code for access token ──────────
    const tokenBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: callbackUrl,
    });
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenRes = await fetch(EVE_SSO.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
        'User-Agent': 'EVE-DED-Tracker/dev (contact: dev@localhost)',
      },
      body: tokenBody,
    });



    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      // strip HTML tags to get the actual error message
      const clean = errText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
      console.error('[EVE SSO DEBUG] token error  :', clean);
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
      if (signInError.message.includes('Invalid login credentials')) {
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
            `${origin}?error=${encodeURIComponent('Sign-in after registration failed.')}`
          );
        }
      } else {
        // This is a network error (like ENOTFOUND) or rate limit, etc.
        console.error('Supabase sign-in error:', signInError);
        return NextResponse.redirect(
          `${origin}?error=${encodeURIComponent('Database connection error. If using local Supabase, ensure it is running.')}`
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
  } catch (err: any) {
    console.error('EVE SSO callback error:', err);
    let errorMsg = 'Authentication failed';
    
    if (err.message && err.message.includes('fetch failed')) {
      errorMsg = 'Failed to connect to EVE SSO servers. Please check your internet connection or DNS.';
    } else if (err.message) {
      errorMsg = err.message;
    }

    return NextResponse.redirect(
      `${origin}?error=${encodeURIComponent(errorMsg)}`
    );
  }
}
