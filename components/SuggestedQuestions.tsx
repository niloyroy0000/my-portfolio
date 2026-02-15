"use client";

import { motion } from "framer-motion";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SUGGESTED_QUESTIONS = [
  "Tell me about SpireWiz",
  "What's your cloud experience?",
  "Have you worked with AI?",
  "What's your current role?",
  "How can I contact you?"
];

export default function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="px-3 sm:px-4 pb-3 border-b border-purple-500/10">
      <p id="suggested-questions-label" className="text-xs text-white/50 mb-2">Suggested questions:</p>
      <div
        className="flex flex-wrap gap-1.5 sm:gap-2"
        role="group"
        aria-labelledby="suggested-questions-label"
      >
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <motion.button
            key={question}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(question)}
            className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 rounded-full transition-all text-purple-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label={`Ask: ${question}`}
          >
            {question}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
