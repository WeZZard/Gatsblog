import React from 'react';

// Simple viewport component without React Helmet to avoid circular reference issues
const Viewport = () => {
  // During SSR, we'll handle this via gatsby-ssr.js
  // During client-side, we can safely set the viewport
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.content = 'width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover';
    }
  }, []);

  return null; // No JSX needed, we handle this via DOM manipulation
};

Viewport.displayName = 'Viewport';

export default Viewport;
