import React from 'react';
import PropTypes from 'prop-types';
import styles from './Contents.module.scss';

import PageInfo from './PageInfo';
import ContentSeparator from './ContentSeparator';

import { normalizeChildren } from '../utils';

const Contents = ({ sections }) => {
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
};

Contents.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.node),
};

export default Contents;
