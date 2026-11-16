import React from 'react';
import styles from './SegmentSeparator.module.scss';

const SegmentSeparator = props => (
  <hr className={[styles.separator, 'body-separator'].join(' ')} {...props} />
);

SegmentSeparator.displayName = 'SegmentSeparator';

export default SegmentSeparator;
