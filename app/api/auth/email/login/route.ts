import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json() as { email?: string; password?: string };
    if (!email?.trim() || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!supabaseUrl || !publishableKey) {
      return NextResponse.json({ error: 'Authentication service is not configured.' }, { status: 500 });
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: publishableKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      cache: 'no-store',
    });
    const result = await response.json() as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      user?: { id: string; email?: string; email_confirmed_at?: string | null; confirmed_at?: string | null };
      error_description?: string;
      msg?: string;
    };
    if (!response.ok || !result.access_token || !result.refresh_token || !result.user) {
      return NextResponse.json({ error: result.error_description || result.msg || 'Invalid email or password.' }, { status: 401 });
    }
    if (!result.user.email_confirmed_at && !result.user.confirmed_at) {
      return NextResponse.json({ error: 'Please verify your email address before signing in.' }, { status: 403 });
    }

    return NextResponse.json({
      user: { id: result.user.id, email: result.user.email, role: 'Applicant' },
      session: {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        expires_in: result.expires_in,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
