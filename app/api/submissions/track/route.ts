import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const accessToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const trackingId = request.nextUrl.searchParams.get('tracking_id')?.trim().toUpperCase();

  if (!supabaseUrl || !publishableKey) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }
  if (!accessToken) {
    return NextResponse.json({ error: 'Please log in before tracking an application.' }, { status: 401 });
  }
  if (!trackingId) {
    return NextResponse.json({ error: 'Tracking ID is required.' }, { status: 400 });
  }

  const authHeaders = { apikey: publishableKey, Authorization: `Bearer ${accessToken}` };
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: authHeaders, cache: 'no-store' });
  if (!userResponse.ok) {
    return NextResponse.json({ error: 'Your login session has expired. Please log in again.' }, { status: 401 });
  }
  const user = await userResponse.json() as { id: string };

  const query = new URLSearchParams({
    select: '*',
    tracking_id: `eq.${trackingId}`,
    user_id: `eq.${user.id}`,
    limit: '1',
  });
  const response = await fetch(`${supabaseUrl}/rest/v1/submissions?${query}`, { headers: authHeaders, cache: 'no-store' });
  if (!response.ok) {
    return NextResponse.json({ error: 'The application could not be loaded.' }, { status: response.status });
  }
  const rows = await response.json() as Array<Record<string, unknown>>;
  return NextResponse.json({ submission: rows[0] ?? null });
}
