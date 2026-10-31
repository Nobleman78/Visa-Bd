import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Backend Supabase credentials are not configured.' }, { status: 500 });
  }

  const accessToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!accessToken) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: publishableKey || serviceRoleKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!userResponse.ok) return NextResponse.json({ error: 'Invalid login session.' }, { status: 401 });
  const user = await userResponse.json() as { id: string };

  const form = await request.formData();
  const trackingId = String(form.get('trackingId') || '').trim();
  if (!trackingId) return NextResponse.json({ error: 'Tracking ID is required.' }, { status: 400 });
  const documents: Record<string, { path: string; name: string; type: string }> = {};

  for (const [field, entry] of form.entries()) {
    if (!(entry instanceof Blob) || typeof (entry as File).name !== 'string' || entry.size === 0) continue;
    const file = entry as File;
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      return NextResponse.json({ error: `${field} has an unsupported file type.` }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: `${field} must be smaller than 10 MB.` }, { status: 400 });
    }
    const extension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'file';
    const safeField = field.replace(/[^a-z0-9_-]/gi, '-');
    const path = `${user.id}/${trackingId}/${safeField}.${extension}`;
    const upload = await fetch(`${supabaseUrl}/storage/v1/object/submission-documents/${path}`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: await file.arrayBuffer(),
    });
    if (!upload.ok) return NextResponse.json({ error: await upload.text() }, { status: 502 });
    documents[field] = { path, name: file.name, type: file.type };
  }

  return NextResponse.json({ documents });
}
