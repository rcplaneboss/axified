'use client';

import { useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
import { Messages } from '@/types';

interface TranscriptProps {
  messages: Messages[];
  currentMessage: string;
  currentUserMessage: string;
}

export default function Transcript({
  messages,
  currentMessage,
  currentUserMessage,
}: TranscriptProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentMessage, currentUserMessage]);

  const isEmpty = messages.length === 0 && !currentMessage && !currentUserMessage;

  return (
    <div className="vapi-transcript-wrapper">
      <div className="transcript-container">
        {isEmpty ? (
          // Empty State
          <div className="transcript-empty">
            <Mic size={48} className="text-gray-400 mb-4" />
            <h3 className="transcript-empty-text">No conversation yet</h3>
            <p className="transcript-empty-hint">Click the mic to start speaking with your AI assistant</p>
          </div>
        ) : (
          // Messages
          <div className="transcript-messages">
            {/* Existing Messages */}
            {messages.map((message, index) => (
              <div key={index} className={`transcript-message transcript-message-${message.role}`}>
                <div
                  className={`transcript-bubble transcript-bubble-${message.role}`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Current User Message (Streaming) */}
            {currentUserMessage && (
              <div className="transcript-message transcript-message-user">
                <div className="transcript-bubble transcript-bubble-user">
                  {currentUserMessage}
                  <span className="transcript-cursor">|</span>
                </div>
              </div>
            )}

            {/* Current Assistant Message (Streaming) */}
            {currentMessage && (
              <div className="transcript-message transcript-message-assistant">
                <div className="transcript-bubble transcript-bubble-assistant">
                  {currentMessage}
                  <span className="transcript-cursor">|</span>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
