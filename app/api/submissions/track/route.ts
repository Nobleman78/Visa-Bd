import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const trackingId = request.nextUrl.searchParams.get('tracking_id')?.trim().toUpperCase();
  const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase();
  const phone = request.nextUrl.searchParams.get('phone')?.trim();
  const userId = request.nextUrl.searchParams.get('user_id')?.trim();

  if (!supabaseUrl || !publishableKey) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }
  if (!trackingId && !email && !phone && !userId) {
    return NextResponse.json({ error: 'Tracking ID, email, phone, or user ID is required.' }, { status: 400 });
  }

  const query = new URLSearchParams({
    select: '*',
    ...(trackingId ? { tracking_id: `eq.${trackingId}` } : {}),
    ...(email ? { email: `ilike.${email}` } : {}),
    ...(phone ? { phone: `eq.${phone}` } : {}),
    ...(userId ? { user_id: `eq.${userId}` } : {}),
    order: 'created_at.desc',
    limit: '1',
  });
  const accessToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const requestKey = trackingId && serviceRoleKey ? serviceRoleKey : accessToken || publishableKey;
  const headers = {
    apikey: trackingId && serviceRoleKey ? serviceRoleKey : publishableKey,
    Authorization: ['Bearer', requestKey].join(' '),
  };
  const response = await fetch(`${supabaseUrl}/rest/v1/submissions?${query}`, { headers, cache: 'no-store' });
  if (!response.ok) {
    return NextResponse.json({ error: 'The application could not be loaded.' }, { status: response.status });
  }
  const rows = await response.json() as Array<Record<string, unknown>>;
  return NextResponse.json({ submissions: rows, submission: rows[0] ?? null });
}
