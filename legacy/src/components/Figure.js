import React from 'react';
import styles from './Figure.module.scss';

const Figure = props => {
  return <figure className={styles.figure} {...props} />;
};

export default Figure;
