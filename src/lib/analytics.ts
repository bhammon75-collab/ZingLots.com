// Analytics tracking utility for button clicks and user interactions

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

class Analytics {
  private queue: AnalyticsEvent[] = [];
  private isInitialized = false;

  constructor() {
    // Initialize analytics on page load
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Check for Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      this.isInitialized = true;
      this.flushQueue();
    } else {
      // Retry initialization after a delay
      setTimeout(() => this.init(), 1000);
    }

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.log('Analytics initialized in development mode');
    }
  }

  private flushQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) {
        this.sendEvent(event);
      }
    }
  }

  private sendEvent(event: AnalyticsEvent) {
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata
      });
    }

    // Also send to custom analytics endpoint if configured
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          referrer: document.referrer
        })
      }).catch(() => {
        // Silently fail analytics requests
      });
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', event);
    }
  }

  track(event: AnalyticsEvent) {
    if (this.isInitialized) {
      this.sendEvent(event);
    } else {
      this.queue.push(event);
    }
  }

  // Convenience methods for common events
  trackClick(element: string, label?: string, value?: number) {
    this.track({
      category: 'UI',
      action: 'click',
      label: label || element,
      value
    });
  }

  trackPageView(page?: string) {
    this.track({
      category: 'Navigation',
      action: 'pageview',
      label: page || window.location.pathname
    });
  }

  trackSearch(query: string, results?: number) {
    this.track({
      category: 'Search',
      action: 'search',
      label: query,
      value: results
    });
  }

  trackPurchase(itemId: string, amount: number, currency = 'USD') {
    this.track({
      category: 'Ecommerce',
      action: 'purchase',
      label: itemId,
      value: amount,
      metadata: { currency }
    });
  }

  trackBid(lotId: string, amount: number) {
    this.track({
      category: 'Auction',
      action: 'bid',
      label: lotId,
      value: amount
    });
  }

  trackSignup(method: string) {
    this.track({
      category: 'User',
      action: 'signup',
      label: method
    });
  }

  trackLogin(method: string) {
    this.track({
      category: 'User',
      action: 'login',
      label: method
    });
  }

  trackError(error: string, fatal = false) {
    this.track({
      category: 'Error',
      action: fatal ? 'fatal_error' : 'error',
      label: error
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// React hook for analytics
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location]);

  return analytics;
}

// Higher-order component for tracking button clicks
export function withAnalytics<T extends { onClick?: (...args: any[]) => void }>(
  Component: React.ComponentType<T>,
  eventName: string,
  category = 'UI'
) {
  return (props: T) => {
    const handleClick = (...args: any[]) => {
      analytics.track({
        category,
        action: 'click',
        label: eventName
      });
      
      if (props.onClick) {
        props.onClick(...args);
      }
    };

    return <Component {...props} onClick={handleClick} />;
  };
}