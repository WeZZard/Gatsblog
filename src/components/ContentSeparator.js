import React from 'react';
import styles from './ContentSeparator.module.scss';

const ContentSeparator = props => (
  <hr {...props} className={styles.contentSeparator} />
);

ContentSeparator.displayName = 'ContentSeparator';

export default ContentSeparator;
