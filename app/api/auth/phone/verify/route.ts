import { createHash, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('880')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+880${digits.slice(1)}`;
  if (digits.length === 10) return `+880${digits}`;
  return `+${digits}`;
}

async function supabaseRequest(input: string, init: RequestInit) {
  return fetch(input, { ...init, signal: AbortSignal.timeout(15000), cache: 'no-store' });
}

export async function POST(request: NextRequest) {
  let phone: string | undefined;
  let otp: string | undefined;
  try {
    ({ phone, otp } = await request.json() as { phone?: string; otp?: string });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  const normalizedPhone = normalizePhone(phone || '');
  if (!/^8801[3-9]\d{8}$/.test(normalizedPhone.replace('+', '')) || !/^\d{6}$/.test(otp || '')) {
    return NextResponse.json({ error: 'Invalid phone number or verification code.' }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey || !publishableKey) {
    return NextResponse.json({ error: 'Authentication service is not configured.' }, { status: 500 });
  }

  const adminHeaders = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
  const challengeResponse = await supabaseRequest(
    `${supabaseUrl}/rest/v1/phone_otp_challenges?phone=eq.${encodeURIComponent(normalizedPhone)}&select=code_hash,expires_at`,
    { headers: adminHeaders },
  );
  const challenges = await challengeResponse.json() as Array<{ code_hash: string; expires_at: string }>;
  const challenge = challenges[0];
  const suppliedHash = Buffer.from(createHash('sha256').update(otp!).digest('hex'), 'hex');
  const storedHash = Buffer.from(challenge?.code_hash || '', 'hex');
  const hashesMatch = storedHash.length === suppliedHash.length && timingSafeEqual(storedHash, suppliedHash);
  if (!challenge || new Date(challenge.expires_at).getTime() <= Date.now() || !hashesMatch) {
    return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 401 });
  }

  await supabaseRequest(`${supabaseUrl}/rest/v1/phone_otp_challenges?phone=eq.${encodeURIComponent(normalizedPhone)}`, {
    method: 'DELETE',
    headers: adminHeaders,
  });

  const usersResponse = await supabaseRequest(`${supabaseUrl}/auth/v1/admin/users?page=1&per_page=1000`, {
    headers: adminHeaders,
  });
  const users = await usersResponse.json() as { users?: Array<{ id: string; phone?: string }> } | Array<{ id: string; phone?: string }>;
  const existingUsers = Array.isArray(users) ? users : users.users || [];
  let userId = existingUsers.find((user) => user.phone && normalizePhone(user.phone) === normalizedPhone)?.id;

  const password = createHash('sha256')
    .update(`${serviceRoleKey}:${normalizedPhone}`)
    .digest('hex');
  const loginEmail = `${normalizedPhone.replace('+', '')}@phone.visabd.local`;

  if (!userId) {
    const createResponse = await supabaseRequest(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        phone: normalizedPhone,
        phone_confirm: true,
        email: loginEmail,
        email_confirm: true,
        password,
      }),
    });
    if (!createResponse.ok) {
      return NextResponse.json({ error: 'Unable to create the phone account.' }, { status: 502 });
    }
    userId = (await createResponse.json() as { id?: string }).id;
  } else {
    await supabaseRequest(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({
        phone: normalizedPhone,
        phone_confirm: true,
        email: loginEmail,
        email_confirm: true,
        password,
      }),
    });
  }
  if (!userId) {
    return NextResponse.json({ error: 'Unable to create phone account.' }, { status: 502 });
  }

  const sessionResponse = await supabaseRequest(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: loginEmail, password }),
  });
  if (!sessionResponse.ok) {
    return NextResponse.json({ error: 'Unable to create authenticated session.' }, { status: 502 });
  }
  const session = await sessionResponse.json() as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: { id: string; phone?: string };
  };
  return NextResponse.json({
    session: {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: session.expires_in,
    },
    user: { id: userId, name: 'Verified Applicant', phone: normalizedPhone },
  });
}
