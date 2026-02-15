"use client";

import { motion } from "framer-motion";
import { FaUser, FaRobot, FaCopy, FaCheck, FaThumbsUp, FaThumbsDown } from "@/lib/icons";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { trackChatbotFeedback } from "@/lib/analytics";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const isUser = message.role === "user";

  // Copy message to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle feedback
  const handleFeedback = (rating: 'positive' | 'negative') => {
    setFeedback(rating);
    trackChatbotFeedback(message.id, rating);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-blue-500/30 to-secondary-default/30 text-blue-400'
            : 'bg-gradient-to-br from-purple-500/30 to-secondary-default/30 text-purple-400'
        }`}
      >
        {isUser ? <FaUser className="text-sm" /> : <FaRobot className="text-sm" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block max-w-[85%] rounded-xl px-4 py-2.5 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500/20 to-secondary-default/20 border border-blue-500/30'
              : 'bg-gradient-to-br from-purple-500/10 to-secondary-default/10 border border-purple-500/20'
          }`}
        >
          {/* Message text with markdown rendering */}
          <div className="text-sm break-words prose prose-invert prose-sm max-w-none markdown-content overflow-hidden">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Timestamp and actions */}
          <div className={`flex items-center gap-2 mt-1 text-xs text-white/40 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span>{formatTime(message.timestamp)}</span>

            {/* Copy button (only for assistant messages) */}
            {!isUser && (
              <>
                <button
                  onClick={copyToClipboard}
                  className="hover:text-secondary-default transition-colors p-1"
                  aria-label="Copy message"
                  title="Copy to clipboard"
                >
                  {copied ? <FaCheck className="text-xs" /> : <FaCopy className="text-xs" />}
                </button>

                {/* Feedback buttons (thumbs up/down) */}
                <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                  <button
                    onClick={() => handleFeedback('positive')}
                    className={`hover:text-green-400 transition-colors p-1 ${
                      feedback === 'positive' ? 'text-green-400' : ''
                    }`}
                    aria-label="Helpful response"
                    title="Helpful"
                    disabled={feedback !== null}
                  >
                    <FaThumbsUp className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleFeedback('negative')}
                    className={`hover:text-red-400 transition-colors p-1 ${
                      feedback === 'negative' ? 'text-red-400' : ''
                    }`}
                    aria-label="Not helpful response"
                    title="Not helpful"
                    disabled={feedback !== null}
                  >
                    <FaThumbsDown className="text-xs" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
