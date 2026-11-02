import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomInt } from 'crypto';

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('880')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+880${digits.slice(1)}`;
  if (digits.length === 10) return `+880${digits}`;
  return `+${digits}`;
}

export async function POST(request: NextRequest) {
  let phone: string | undefined;
  try {
    ({ phone } = await request.json() as { phone?: string });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
  const normalizedPhone = phone ? normalizePhone(phone) : '';
  if (!/^8801[3-9]\d{8}$/.test(normalizedPhone.replace('+', ''))) {
    return NextResponse.json({ error: 'Please enter a valid Bangladeshi mobile number.' }, { status: 400 });
  }

  const apiKey = process.env.BULKSMSBD_API_KEY?.trim() || process.env.messageApiKey?.trim();
  const apiUrl = process.env.BULKSMSBD_API_URL?.trim() || 'https://bulksmsbd.net/api/smsapi';
  const senderId = process.env.BULKSMSBD_SENDER_ID?.trim() || process.env.senderId?.trim();
  if (!apiKey || !senderId) {
    return NextResponse.json({ error: 'SMS service is not configured. Add BULKSMSBD_SENDER_ID to .env.local.' }, { status: 500 });
  }

  const code = String(randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'OTP storage service is not configured.' }, { status: 500 });
  }

  let challengeResponse: Response;
  try {
    challengeResponse = await fetch(`${supabaseUrl}/rest/v1/phone_otp_challenges?on_conflict=phone`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        phone: normalizedPhone,
        code_hash: createHash('sha256').update(code).digest('hex'),
        expires_at: expiresAt,
      }),
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unable to reach OTP storage.',
    }, { status: 502 });
  }
  if (!challengeResponse.ok) {
    const details = await challengeResponse.text();
    return NextResponse.json({ error: 'Unable to create phone verification challenge.', details }, { status: 502 });
  }

  const smsUrl = new URL(apiUrl);
  smsUrl.searchParams.set('api_key', apiKey);
  smsUrl.searchParams.set('type', 'text');
  smsUrl.searchParams.set('number', normalizedPhone.replace('+', ''));
  smsUrl.searchParams.set('senderid', senderId);
  smsUrl.searchParams.set('message', `Your WorkVisaBd OTP is ${code}`);

  let smsResponse: Response;
  try {
    smsResponse = await fetch(smsUrl, { signal: AbortSignal.timeout(15000) });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unable to reach BulkSMSBD.',
    }, { status: 502 });
  }
  const smsBody = await smsResponse.text();
  let providerFailed = !smsResponse.ok || /error|invalid|failed/i.test(smsBody);
  try {
    const providerResult = JSON.parse(smsBody) as {
      response_code?: number | string;
      error_message?: string;
    };
    const successfulCodes = ['1000', '202'];
    providerFailed = !successfulCodes.includes(String(providerResult.response_code));
  } catch {
    // Plain-text provider responses are handled below.
  }
  if (providerFailed) {
    await fetch(`${supabaseUrl}/rest/v1/phone_otp_challenges?phone=eq.${encodeURIComponent(normalizedPhone)}`, {
      method: 'DELETE',
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    });
    return NextResponse.json({
      error: 'Unable to send SMS verification code.',
    }, { status: 502 });
  }
  return NextResponse.json({ message: `Verification code sent to ${normalizedPhone}.` });
}
