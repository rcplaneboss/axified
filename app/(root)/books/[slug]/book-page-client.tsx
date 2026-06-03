'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Mic } from 'lucide-react';
import { IBook } from '@/types';
import VapiControls from '@/components/VapiControls';

interface BookPageClientProps {
  book: IBook;
}

export default function BookPageClient({ book }: BookPageClientProps) {
  const router = useRouter();

  return (
    <div className="book-page-container min-h-screen bg-[#f8f4e9] p-6">
      {/* Floating Back Button */}
      <button
        onClick={() => router.back()}
        className="back-btn-floating fixed top-24 left-6 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center z-10"
        aria-label="Go back"
      >
        <ArrowLeft size={20} className="text-gray-900" />
      </button>

      {/* Main Content Container */}
      <div className="mx-auto max-w-4xl">
        {/* Transcript Area */}
        <VapiControls book={book} />
      </div>
    </div>
  );
}
