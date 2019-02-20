import React from 'react';
import styles from './Span.module.scss';

export default props => {
  return <span className={styles.span} {...props} />;
};
