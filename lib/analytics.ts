// Google Analytics tracking utilities

declare const gtag: (
  command: 'config' | 'event' | 'consent',
  targetId: string,
  config?: Record<string, unknown>
) => void;

export const GA_MEASUREMENT_ID = 'G-JG3RM88C15';

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track specific portfolio events
export const trackPortfolioEvent = (eventName: string, projectName?: string) => {
  trackEvent(eventName, 'Portfolio', projectName);
};

// Track certification events
export const trackCertificationEvent = (eventName: string, certificationName?: string) => {
  trackEvent(eventName, 'Certifications', certificationName);
};

// Track contact form events
export const trackContactEvent = (eventName: string, formType?: string) => {
  trackEvent(eventName, 'Contact', formType);
};

// Track file downloads
export const trackDownload = (fileName: string) => {
  trackEvent('download', 'File', fileName);
};

// Track outbound link clicks
export const trackOutboundLink = (url: string, linkText?: string) => {
  trackEvent('click', 'Outbound Link', linkText || url);
};

// Track social media clicks
export const trackSocialClick = (platform: string) => {
  trackEvent('click', 'Social Media', platform);
};

// ========================================
// CHATBOT ANALYTICS (Epic 6.1.5)
// ========================================

// Track chatbot open/close
export const trackChatbotOpen = () => {
  trackEvent('chatbot_open', 'Chatbot', 'Chat Window Opened');
};

export const trackChatbotClose = () => {
  trackEvent('chatbot_close', 'Chatbot', 'Chat Window Closed');
};

export const trackChatbotMinimize = () => {
  trackEvent('chatbot_minimize', 'Chatbot', 'Chat Window Minimized');
};

// Track chatbot messages
export const trackChatbotMessage = (messageText: string, messageLength: number) => {
  // Sanitize message (don't send full content to analytics for privacy)
  const sanitized = messageText.length > 50
    ? `${messageText.substring(0, 50)}...`
    : messageText;

  trackEvent('chatbot_message_sent', 'Chatbot', sanitized, messageLength);
};

// Track suggested question clicks
export const trackChatbotSuggestedQuestion = (question: string) => {
  trackEvent('chatbot_suggested_question', 'Chatbot', question);
};

// Track chatbot errors
export const trackChatbotError = (errorType: string, errorMessage?: string) => {
  trackEvent('chatbot_error', 'Chatbot', `${errorType}: ${errorMessage || 'Unknown'}`);
};

// Track conversation metrics
export const trackChatbotConversation = (messageCount: number, durationSeconds: number) => {
  trackEvent('chatbot_conversation_end', 'Chatbot', `${messageCount} messages`, durationSeconds);
};

// Track chatbot feedback (thumbs up/down)
export const trackChatbotFeedback = (messageId: string, rating: 'positive' | 'negative') => {
  trackEvent('chatbot_feedback', 'Chatbot', `Message ${messageId}: ${rating}`);
};

// Track chatbot clear conversation
export const trackChatbotClear = (messageCount: number) => {
  trackEvent('chatbot_clear', 'Chatbot', `Cleared ${messageCount} messages`);
};

// ========================================
// RESUME DOWNLOAD ANALYTICS (Epic 6.3.1)
// ========================================

// Track resume downloads with context
export const trackResumeDownload = (location: string, metadata?: {
  pageUrl?: string;
  referrer?: string;
  timeOnPage?: number;
  scrollDepth?: number;
}) => {
  if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
    // Send detailed event to Google Analytics
    gtag('event', 'resume_download', {
      event_category: 'Engagement',
      event_label: location,
      page_location: metadata?.pageUrl || window.location.href,
      page_referrer: metadata?.referrer || document.referrer,
      time_on_page: metadata?.timeOnPage || 0,
      scroll_depth: metadata?.scrollDepth || 0,
      value: 1,
    });

    // Store download event in localStorage for analytics dashboard
    try {
      const downloads = JSON.parse(localStorage.getItem('resume_downloads') || '[]');
      downloads.push({
        location,
        timestamp: Date.now(),
        pageUrl: metadata?.pageUrl || window.location.href,
        referrer: metadata?.referrer || document.referrer || 'Direct',
        timeOnPage: metadata?.timeOnPage || 0,
      });
      // Keep only last 100 downloads
      if (downloads.length > 100) {
        downloads.shift();
      }
      localStorage.setItem('resume_downloads', JSON.stringify(downloads));
    } catch (error) {
      console.error('Failed to store resume download:', error);
    }
  }
}; 