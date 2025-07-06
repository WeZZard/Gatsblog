import React from 'react';
import PropTypes from 'prop-types';
import styles from './Contents.module.scss';

import PageInfo from './PageInfo';
import ContentSeparator from './ContentSeparator';

import { normalizeChildren } from '../utils';

const Contents = ({ sections }) => {
  // Try to handle sections safely, catching any circular reference errors
  try {
    // If sections is already a React element (most common case), render it directly
    if (sections && typeof sections === 'object' && !Array.isArray(sections)) {
      return (
        <div className={styles.contents}>
          <div className={styles.section}>{sections}</div>
          <ContentSeparator />
          <footer className={styles.section}>
            <PageInfo />
          </footer>
        </div>
      );
    }

    const normalizedSections = normalizeChildren(sections);
    const numberOfContents = normalizedSections.length;

    const children = normalizedSections.map((content, index) => (
      <React.Fragment key={index}>
        <div className={styles.section}>{content}</div>
        {index + 1 < numberOfContents ? (
          <ContentSeparator key={`${index}-separator`} />
        ) : null}
      </React.Fragment>
    ));

    return (
      <div className={styles.contents}>
        {children}
        <ContentSeparator />
        <footer className={styles.section}>
          <PageInfo />
        </footer>
      </div>
    );
  } catch (error) {
    // Fallback: render sections directly without processing
    return (
      <div className={styles.contents}>
        <div className={styles.section}>{sections}</div>
        <ContentSeparator />
        <footer className={styles.section}>
          <PageInfo />
        </footer>
      </div>
    );
  }
};

Contents.propTypes = {
  sections: PropTypes.any,
};

export default Contents;
