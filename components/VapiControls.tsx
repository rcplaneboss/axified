import useVapi from '@/hooks/useVapi';
import { IBook } from '@/types';
import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import Image from 'next/image';
import Transcript from './Transcript';


export default function VapiControls({book} : {book: IBook }) {

  const {status,
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        start,
        stop,
        limitError,
        clearError} = useVapi(book);
    return (
      <>

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
                onClick={isActive ? stop : start } 
                disabled={status === "connecting"}
                className="vapi-mic-btn absolute bottom-0 right-0 translate-x-16 -translate-y-10 w-16 h-16 rounded-full bg-white border-4 border-[#f3e4c7] shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center relative"
                aria-label={isActive ? "Stop voice conversation" : "Start voice conversation"}
              >
                {/* Pulsating ring - shows when active and AI is speaking/thinking */}
                {isActive && (status === 'speaking' || status === 'thinking') && (
                  <div className="absolute inset-0 rounded-full border-2 border-white animate-ping pointer-events-none"></div>
                )}
                
                {isActive ? (
                  <Mic size={28} className="text-gray-900" />
                ) : (
                  <MicOff size={28} className="text-gray-900" />
                )}
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
        <Transcript 
          messages={messages}
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
        </>
    );
}