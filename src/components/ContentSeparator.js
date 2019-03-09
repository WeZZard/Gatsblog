import React from 'react';
import styles from './ContentSeparator.module.scss';

const ContentSeparator = props => (
  <div className={styles.marginBox}>
    <hr {...props} className={styles.contentSeparator} />
  </div>
);

ContentSeparator.displayName = 'ContentSeparator';

export default ContentSeparator;
