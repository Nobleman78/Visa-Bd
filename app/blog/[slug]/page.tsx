// SERVER COMPONENT — resolves async params, passes data to the client content component
import { notFound } from 'next/navigation';
import { STORIES } from '../../../data/stories-data';
import ArticleContent from './ArticleContent';
import { fetchPublishedStories } from '../../../lib/supabase';

// Tell Next.js 16 this route may block on params — compatible with cacheComponents:true
export const instant = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Build-time: pre-render a page for every story slug
export async function generateStaticParams() {
  const apiStories = await fetchPublishedStories();
  const stories = apiStories.length ? apiStories : STORIES;
  return stories.map((s) => ({ slug: s.slug }));
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const apiStories = await fetchPublishedStories();
  const stories = apiStories.length ? apiStories : STORIES;
  const story = stories.find((s) => s.slug === slug);
  if (!story) notFound();

  const relatedStories = stories.filter((s) => s.slug !== slug).slice(0, 2);

  return <ArticleContent story={story} relatedStories={relatedStories} />;
}
