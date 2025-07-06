import React from 'react';

interface SiteFooterProps {
  showsSlogans?: boolean;
}

const SiteFooter: React.FC<SiteFooterProps> = ({ showsSlogans }) => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} WeZZard. All rights reserved.</p>
      {showsSlogans && <p>Blog slogan here</p>}
    </footer>
  );
};

export default SiteFooter;