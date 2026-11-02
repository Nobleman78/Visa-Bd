import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json() as { email?: string; code?: string };
    const trimmedEmail = email?.trim().toLowerCase() ?? '';
    const trimmedCode = code?.trim().replace(/\s+/g, '') ?? '';

    if (!trimmedEmail || !trimmedCode) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !publishableKey) {
      return NextResponse.json({ error: 'Authentication service is not configured.' }, { status: 500 });
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/verify`, {
      method: 'POST',
      headers: {
        apikey: publishableKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'email',
        email: trimmedEmail,
        token: trimmedCode,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = 'Invalid or expired verification code.';
      try {
        const parsed = JSON.parse(errorText) as { msg?: string; message?: string; error_description?: string };
        errorMsg = parsed.msg || parsed.message || parsed.error_description || 'Invalid or expired code.';
      } catch {
        // fallback
      }
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const sessionData = await response.json() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      user: {
        id: string;
        email?: string;
        phone?: string;
        user_metadata?: { full_name?: string; avatar_url?: string };
      };
    };

    const userId = sessionData.user.id;
    const userName = sessionData.user.user_metadata?.full_name || trimmedEmail.split('@')[0];
    const avatar = sessionData.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`;

    // Sync applicant_profile in Supabase if service role key is available
    if (serviceRoleKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/applicant_profiles?on_conflict=user_id`, {
          method: 'POST',
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal',
          },
          body: JSON.stringify({
            user_id: userId,
            email: trimmedEmail,
            full_name: userName,
            verified: true,
          }),
        });
      } catch (err) {
        console.error('Failed to sync applicant profile:', err);
      }
    }

    return NextResponse.json({
      session: {
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
        expires_in: sessionData.expires_in,
      },
      user: {
        id: userId,
        name: userName,
        email: trimmedEmail,
        phone: sessionData.user.phone || '',
        role: 'Verified Applicant',
        avatar,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error verifying credentials.' },
      { status: 500 },
    );
  }
}

