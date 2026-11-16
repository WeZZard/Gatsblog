import React from 'react';
import styles from './FigureCaption.module.scss';

const FigureCaption = props => {
  return <figcaption className={styles.figcaption} {...props} />;
};

export default FigureCaption;
