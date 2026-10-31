import { NextRequest, NextResponse } from 'next/server';

const DEMO_PHONE = '+8801712345678';
const DEMO_OTP = '849201';

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('880')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+880${digits.slice(1)}`;
  if (digits.length === 10) return `+880${digits}`;
  return `+${digits}`;
}

export async function POST(request: NextRequest) {
  const { phone } = await request.json() as { phone?: string };
  if (!phone || normalizePhone(phone) !== DEMO_PHONE) {
    return NextResponse.json({ error: 'Demo login is only available for the configured phone number.' }, { status: 400 });
  }
  return NextResponse.json({ message: 'Verification code sent.', demoOtp: DEMO_OTP });
}
