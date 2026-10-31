// SERVER COMPONENT — resolves dynamic route and passes data to client component
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import VisaDetailPage from './VisaDetailPage';
import { fetchPublishedVisas } from '../../../../lib/supabase';

export const instant = false;

interface PageProps {
  params: Promise<{ country: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const visas = await fetchPublishedVisas();
    if (visas && visas.length > 0) {
      return visas.map((v) => ({
        country: v.countrySlug,
        slug: v.slug,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch published visas for static params:', error);
  }

  // Fallback to satisfy Next.js Cache Components requirement when offline/timeout
  return [
    {
      country: 'japan',
      slug: 'japan-visa',
    },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { country, slug } = await params;
  const apiVisas = await fetchPublishedVisas();
  const visas = apiVisas;
  const visa = visas.find(
    (v) => v.countrySlug === country && v.slug === slug
  );
  if (!visa) return { title: 'Visa Not Found | VisaBD' };
  return {
    title: `${visa.visaTitle} — ${visa.country} | VisaBD`,
    description: visa.overview,
  };
}

export default async function Page({ params }: PageProps) {
  await connection();
  const { country, slug } = await params;
  const apiVisas = await fetchPublishedVisas();
  const visas = apiVisas;

  const visa = visas.find(
    (v) => v.countrySlug === country && v.slug === slug
  );
  if (!visa) notFound();

  const related = visas.filter(
    (v) => v.id !== visa.id && v.region === visa.region
  ).slice(0, 3);

  return <VisaDetailPage visa={visa} relatedVisas={related} />;
}