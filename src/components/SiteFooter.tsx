import React from 'react';

const SiteFooter: React.FC = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} WeZZard. All rights reserved.</p>
    </footer>
  );
};

export default SiteFooter;