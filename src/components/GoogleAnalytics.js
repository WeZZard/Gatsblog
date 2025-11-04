import React from 'react';

// Simple Google Analytics component without React Helmet to avoid circular reference issues
export default () => {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && process.env.GATSBY_GA_TRACKING_ID) {
      // Initialize Google Analytics
      window.ga = window.ga || function() { (window.ga.q = window.ga.q || []).push(arguments); };
      window.ga.l = +new Date();
      window.ga('create', process.env.GATSBY_GA_TRACKING_ID, 'auto');
      window.ga('send', 'pageview');

      // Load the analytics script
      if (!document.querySelector('script[src*="google-analytics.com/analytics.js"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.google-analytics.com/analytics.js';
        document.head.appendChild(script);
      }
    }
  }, []);

  return null; // No JSX needed, we handle this via DOM manipulation
};
