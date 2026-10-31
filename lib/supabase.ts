import type { WorkVisa } from '../data/visa-data';
import type { Story } from '../data/stories-data';
import { STORIES } from '../data/stories-data';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

export const hasSupabaseConfig = Boolean(url && key);

function restHeaders(accessToken?: string) {
  return {
    apikey: key || '',
    Authorization: `Bearer ${accessToken || key || ''}`,
    Accept: 'application/json',
  };
}

export async function fetchPublishedVisas() {
  if (!url || !key) return [];
  try {
    const response = await fetch(`${url}/rest/v1/work_visas?select=*&status=eq.Published&order=created_at.desc`, {
      headers: restHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const rows = await response.json() as Array<Record<string, unknown>>;
    if (!rows.length) return [];
    const backendVisas = rows.map((row) => ({
      id: String(row.id ?? ''),
      slug: String(row.slug ?? ''),
      countrySlug: String(row.country_slug ?? ''),
      country: String(row.country ?? ''),
      countryCode: String(row.country_code ?? '').toLowerCase(),
      flag: String(row.flag ?? ''),
      region: String(row.region ?? 'Asia') as WorkVisa['region'],
      visaTitle: String(row.visa_title ?? row.title ?? ''),
      categoryTag: String(row.category_tag ?? ''),
      badge: typeof row.badge === 'string' ? row.badge : undefined,
      processingTime: String(row.processing_time ?? ''),
      averageSalary: String(row.average_salary ?? ''),
      validity: String(row.validity ?? ''),
      minEducation: String(row.min_education ?? ''),
      languageRequirement: String(row.language_requirement ?? ''),
      govtFee: String(row.govt_fee ?? ''),
      serviceFee: String(row.service_fee ?? ''),
      currency: String(row.currency ?? ''),
      image: String(row.image ?? ''),
      overview: String(row.overview ?? ''),
      keyBenefits: Array.isArray(row.key_benefits) ? row.key_benefits.map(String) : [],
      eligibilityChecklist: Array.isArray(row.eligibility_checklist) ? row.eligibility_checklist.map(String) : [],
      requiredDocuments: Array.isArray(row.required_documents) ? row.required_documents.map(String) : [],
      applicationStages: Array.isArray(row.application_stages) ? row.application_stages.map(String) : [],
    }));
    return backendVisas;
  } catch (error) {
    console.error('Unable to load published visas.', error);
    return [];
  }
}

export async function fetchPublishedStories(table: 'blogs' | 'stories' = 'blogs') {
  if (!url || !key) return STORIES;
  try {
    const response = await fetch(`${url}/rest/v1/${table}?select=*&status=eq.Published&order=created_at.desc`, {
      headers: restHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) return STORIES;
    const rows = await response.json() as Array<Record<string, unknown>>;
    if (!rows.length) return STORIES;
    return rows.map((row) => {
      const author = typeof row.author === 'object' && row.author !== null ? row.author as Record<string, unknown> : {};
      return {
        id: String(row.id ?? ''),
        title: String(row.title ?? ''),
        slug: String(row.slug ?? ''),
        category: String(row.category ?? 'General'),
        excerpt: String(row.excerpt ?? ''),
        content: String(row.content ?? ''),
        coverImage: String(row.cover_image ?? ''),
        author: {
          name: String(author.name ?? 'VisaBD Editorial Team'),
          role: String(author.role ?? 'Editorial'),
          avatar: String(author.avatar ?? ''),
        },
        publishedAt: String(row.published_at ?? ''),
        readingTime: String(row.reading_time ?? ''),
      } satisfies Story;
    });
  } catch (error) {
    console.error('Unable to load published stories; using local fallback data.', error);
    return STORIES;
  }
}

export function storeSupabaseSession(session: { access_token: string; refresh_token: string }) {
  localStorage.setItem('visabd_supabase_session', JSON.stringify(session));
}

export function getStoredSupabaseSession() {
  const stored = localStorage.getItem('visabd_supabase_session');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as { access_token: string; refresh_token: string };
  } catch {
    localStorage.removeItem('visabd_supabase_session');
    return null;
  }
}

export function getStoredAccessToken() {
  return getStoredSupabaseSession()?.access_token ?? null;
}

export async function createSubmission(data: Record<string, unknown>) {
  if (!url || !key) return;
  const accessToken = getStoredAccessToken();
  const response = await fetch(`${url}/rest/v1/submissions`, {
    method: 'POST',
    headers: {
      ...restHeaders(accessToken || undefined),
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.text();
    try {
      const parsed = JSON.parse(body) as { message?: string };
      throw new Error(parsed.message || body);
    } catch {
      throw new Error(body || 'Submission was rejected by Supabase.');
    }
  }
}

export async function createAppointment(data: Record<string, unknown>) {
  if (!url || !key) throw new Error('Supabase is not configured.');
  const response = await fetch(`${url}/rest/v1/appointments`, {
    method: 'POST',
    headers: {
      ...restHeaders(),
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await response.text());
}

export async function fetchTrackedSubmission(trackingId: string) {
  const accessToken = getStoredAccessToken();
  if (!accessToken) throw new Error('Please log in before tracking an application.');
  const response = await fetch(`/api/submissions/track?tracking_id=${encodeURIComponent(trackingId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    if (response.status === 401) localStorage.removeItem('visabd_supabase_session');
    throw new Error(body?.error || 'Unable to track this application.');
  }
  const result = await response.json() as { submission?: Record<string, unknown> | null };
  return result.submission ?? null;
}

export async function uploadSubmissionDocuments(formData: FormData, trackingId: string) {
  const accessToken = getStoredAccessToken();
  if (!accessToken) throw new Error('Please log in before uploading documents.');
  formData.set('trackingId', trackingId);
  const response = await fetch('/api/submissions/documents', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });
  const result = await response.json() as {
    documents?: Record<string, { path: string; name: string; type: string }>;
    error?: string;
  };
  if (!response.ok) throw new Error(result.error || 'Document upload failed.');
  return result.documents || {};
}
