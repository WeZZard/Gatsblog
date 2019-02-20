import React from 'react';
import styles from './Checkbox.module.scss';

export default props => {
  return <input className={styles.checkbox} {...props} />;
};
