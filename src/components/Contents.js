import React from 'react';
import PropTypes from 'prop-types';
import styles from './Contents.module.scss';

import PageInfo from './PageInfo';
import ContentSeparator from './ContentSeparator';

// Removed normalizeChildren import to avoid circular reference issues during SSR

const Contents = ({ sections }) => {
  // Defensive check to avoid circular reference issues with CSS modules during SSR
  const safeStyles = styles || {};
  
  // Always render sections directly to avoid circular reference issues
  // This is the safest approach for SSR with React elements
  return (
    <div className={safeStyles.contents || 'contents'}>
      <div className={safeStyles.section || 'section'}>{sections}</div>
      <ContentSeparator />
      <footer className={safeStyles.section || 'section'}>
        <PageInfo />
      </footer>
    </div>
  );
};

Contents.propTypes = {
  sections: PropTypes.any,
};

export default Contents;
