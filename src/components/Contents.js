import React from 'react';
import PropTypes from 'prop-types';
import styles from './Contents.module.scss';

import PageInfo from './PageInfo';
import ContentSeparator from './ContentSeparator';

// Removed normalizeChildren import to avoid circular reference issues during SSR

const Contents = ({ sections }) => {
  // Always render sections directly to avoid circular reference issues
  // This is the safest approach for SSR with React elements
  return (
    <div className={styles.contents}>
      <div className={styles.section}>{sections}</div>
      <ContentSeparator />
      <footer className={styles.section}>
        <PageInfo />
      </footer>
    </div>
  );
};

Contents.propTypes = {
  sections: PropTypes.any,
};

export default Contents;
