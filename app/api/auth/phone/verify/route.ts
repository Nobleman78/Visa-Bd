import { NextRequest, NextResponse } from 'next/server';

const DEMO_PHONE = '+8801712345678';
const DEMO_OTP = '849201';
const DEMO_PASSWORD = 'VisabdDemo#849201';
const DEMO_EMAIL = 'visabd-demo@example.com';

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('880')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+880${digits.slice(1)}`;
  if (digits.length === 10) return `+880${digits}`;
  return `+${digits}`;
}

async function fetchSupabase(input: string, init: RequestInit = {}) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await fetch(input, {
        ...init,
        signal: AbortSignal.timeout(15000),
      });
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw lastError;
}

export async function POST(request: NextRequest) {
  let phone: string | undefined;
  let otp: string | undefined;
  try {
    const body = await request.json() as { phone?: string; otp?: string };
    phone = body.phone;
    otp = body.otp;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!phone || normalizePhone(phone) !== DEMO_PHONE || otp !== DEMO_OTP) {
    return NextResponse.json({ error: 'Invalid phone number or verification code.' }, { status: 401 });
  }
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Backend Supabase credentials are not configured.' }, { status: 500 });
  }

  const adminHeaders = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
  let userId: string | undefined;
  async function findDemoUser() {
    const filterUrls = [
      `${supabaseUrl}/auth/v1/admin/users?filter=phone%20eq%20%22${encodeURIComponent(DEMO_PHONE)}%22&page=1&per_page=1000`,
      `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=1000`,
    ];
    for (const lookupUrl of filterUrls) {
      const lookup = await fetchSupabase(lookupUrl, { headers: adminHeaders, cache: 'no-store' });
      if (!lookup.ok) continue;
      const lookupText = await lookup.text();
      try {
        const parsed = JSON.parse(lookupText) as
          | { users?: Array<{ id: string; phone?: string }> }
          | Array<{ id: string; phone?: string }>;
        const users = Array.isArray(parsed) ? parsed : parsed.users || [];
        const match = users.find((user) =>
          Boolean(user.phone && normalizePhone(user.phone) === DEMO_PHONE)
        );
        if (match) return match.id;
      } catch {
        continue;
      }
    }
    return undefined;
  }

  userId = await findDemoUser();
  if (!userId) {
    const create = await fetchSupabase(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        phone: DEMO_PHONE,
        phone_confirm: true,
        email: DEMO_EMAIL,
        email_confirm: true,
        password: DEMO_PASSWORD,
        user_metadata: { full_name: 'Md. Tariqul Islam' },
      }),
    });
    const createText = await create.text();
    if (create.ok) {
    try {
        userId = (JSON.parse(createText) as { id?: string }).id;
    } catch {
      userId = undefined;
    }
    } else {
      userId = await findDemoUser();
      if (!userId) {
        return NextResponse.json({
          error: `The demo phone still exists in Supabase Auth. ${createText}`,
        }, { status: 409 });
      }
    }
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unable to find or create the demo account.' }, { status: 502 });
  }

  await fetchSupabase(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      email: DEMO_EMAIL,
      email_confirm: true,
      password: DEMO_PASSWORD,
      phone: DEMO_PHONE,
      phone_confirm: true,
    }),
  });

  const tokenResponse = await fetchSupabase(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: publishableKey || serviceRoleKey,
      Authorization: `Bearer ${publishableKey || serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  });
  if (!tokenResponse.ok) return NextResponse.json({ error: await tokenResponse.text() }, { status: 502 });

  const tokenText = await tokenResponse.text();
  let session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: { id: string; phone?: string; user_metadata?: { full_name?: string } };
  };
  try {
    session = JSON.parse(tokenText) as typeof session;
  } catch {
    return NextResponse.json({ error: tokenText || 'Supabase returned an invalid session response.' }, { status: 502 });
  }
  return NextResponse.json({
    session,
    user: {
      id: session.user.id,
      name: session.user.user_metadata?.full_name || 'Md. Tariqul Islam',
      phone: session.user.phone || DEMO_PHONE,
    },
  });
}
