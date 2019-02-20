import React from 'react';
import styles from './PreFormattedBlock.module.scss';

const PreFormattedBlock = props => (
  <pre className={styles.preFormattedBlock} {...props} />
);

PreFormattedBlock.displayName = 'PreFormattedBlock';

export default PreFormattedBlock;
