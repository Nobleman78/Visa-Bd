import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json() as { fullName?: string; email?: string; password?: string };
    const normalizedName = fullName?.trim() || '';
    const normalizedEmail = email?.trim().toLowerCase() || '';

    if (normalizedName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || !password || password.length < 8) {
      return NextResponse.json({ error: 'Enter your name, a valid email address, and a password of at least 8 characters.' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server authentication is not configured.' }, { status: 500 });
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: { full_name: normalizedName, role: 'applicant' },
      }),
      cache: 'no-store',
    });
    const result = await response.json() as { id?: string; message?: string; msg?: string };
    if (!response.ok) {
      const message = result.message || result.msg || 'Unable to create your account.';
      const status = /already.*registered|already.*exist/i.test(message) ? 409 : response.status;
      return NextResponse.json({ error: message }, { status });
    }
    if (!result.id) {
      return NextResponse.json({ error: 'Account was created without a user ID.' }, { status: 500 });
    }

    return NextResponse.json({ created: true, login: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
