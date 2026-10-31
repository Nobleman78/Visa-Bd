import type { WorkVisa } from '../data/visa-data';
import type { Story } from '../data/stories-data';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

export const hasSupabaseConfig = Boolean(url && key);

export async function fetchPublishedVisas() {
  if (!url || !key) return [];

  const response = await fetch(`${url}/rest/v1/work_visas?select=*&order=created_at.desc`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) return [];

  const rows = await response.json() as Array<Record<string, unknown>>;
  return rows.map((row) => ({
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
}

export async function fetchPublishedStories(table: 'blogs' | 'stories' = 'blogs') {
  if (!url || !key) return [];

  const response = await fetch(`${url}/rest/v1/${table}?select=*&status=eq.Published&order=created_at.desc`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) return [];

  const rows = await response.json() as Array<Record<string, unknown>>;
  return rows.map((row) => {
    const author = typeof row.author === 'object' && row.author !== null
      ? row.author as Record<string, unknown>
      : {};

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
}

export async function createSubmission(data: Record<string, unknown>) {
  if (!url || !key) return;
  const response = await fetch(`${url}/rest/v1/submissions`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await response.text());
}

export async function createAppointment(data: Record<string, unknown>) {
  if (!url || !key) throw new Error('Supabase is not configured.');

  const response = await fetch(`${url}/rest/v1/appointments`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(await response.text());
}
