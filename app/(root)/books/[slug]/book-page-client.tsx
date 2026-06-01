'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Mic } from 'lucide-react';
import { IBook } from '@/types';

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
        {/* Header Card */}
        <div className="vapi-header-card rounded-xl p-8 mb-8" style={{ backgroundColor: '#f3e4c7' }}>
          <div className="flex gap-8">
            {/* Book Cover with Mic Button */}
            <div className="relative flex-shrink-0">
              <div className="w-[120px] h-[160px] relative rounded-lg overflow-hidden shadow-md">
                <Image
                  src={book.coverURL || '/assets/placeholder-book.png'}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Mic Button - Floating on Bottom Right */}
              <button
                className="vapi-mic-btn absolute bottom-0 right-0 translate-x-2 translate-y-2 w-16 h-16 rounded-full bg-white border-4 border-[#f3e4c7] shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
                aria-label="Start voice conversation"
              >
                <Mic size={28} className="text-gray-900" />
              </button>
            </div>

            {/* Book Info */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-2">
                {book.title}
              </h1>

              {/* Author */}
              <p className="text-lg text-gray-700 mb-6">
                by {book.author}
              </p>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3">
                {/* Ready Status Badge */}
                <div className="vapi-status-indicator bg-white rounded-full px-4 py-2 flex items-center gap-2">
                  <div className="vapi-status-dot w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="vapi-status-text text-sm font-medium text-gray-900">Ready</span>
                </div>

                {/* Voice Badge */}
                <div className="bg-white rounded-full px-4 py-2 flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    Voice: {book.persona || 'Default'}
                  </span>
                </div>

                {/* Timer Badge */}
                <div className="bg-white rounded-full px-4 py-2 flex items-center">
                  <span className="text-sm font-medium text-gray-900">0:00/15:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Area */}
        <div className="transcript-container w-full rounded-xl bg-white p-12 min-h-[400px] flex flex-col items-center justify-center shadow-sm border border-gray-100">
          <Mic size={48} className="text-gray-300 mb-4" />
          <h2 className="transcript-empty text-2xl font-bold text-gray-900 mb-2">
            No conversation yet
          </h2>
          <p className="transcript-empty-hint text-gray-500 text-center">
            Click the mic button above to start talking
          </p>
        </div>
      </div>
    </div>
  );
}
