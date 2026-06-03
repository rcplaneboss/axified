import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getBookBySlug } from '@/lib/actions/book.actions';
import BookPageClient from './book-page-client';

interface BookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BookPage({ params }: BookPageProps) {
  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  const { slug } = await params;

  // Fetch book from database
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect('/');
  }

  const book = result.data;

  return <BookPageClient book={book} />;
}
