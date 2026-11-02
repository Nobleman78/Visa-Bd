import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json() as { email?: string; fullName?: string };
    const trimmedEmail = email?.trim().toLowerCase() ?? '';

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid Gmail or email address.' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!supabaseUrl || !publishableKey) {
      return NextResponse.json({ error: 'Authentication service is not configured.' }, { status: 500 });
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/otp`, {
      method: 'POST',
      headers: {
        apikey: publishableKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: trimmedEmail,
        create_user: true,
        data: {
          full_name: fullName?.trim() || trimmedEmail.split('@')[0],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = 'Failed to send verification email.';
      try {
        const parsed = JSON.parse(errorText) as { msg?: string; message?: string; error_description?: string; error_code?: string };
        if (parsed.error_code === 'over_email_send_rate_limit' || /rate limit/i.test(errorText)) {
          errorMsg = 'Email rate limit reached on Supabase. Please wait a few moments and try again.';
        } else {
          errorMsg = parsed.msg || parsed.message || parsed.error_description || errorText;
        }
      } catch {
        // fallback
      }
      return NextResponse.json({ error: errorMsg }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${trimmedEmail}. Please check your Gmail inbox.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error sending verification code.' },
      { status: 500 },
    );
  }
}
