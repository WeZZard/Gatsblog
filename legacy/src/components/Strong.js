import React from 'react';
import styles from './Strong.module.scss';

const Strong = props => <strong className={styles.strong} {...props} />;

Strong.displayName = 'Strong';

export default Strong;
