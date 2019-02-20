import React from 'react';
import styles from './Image.module.scss';

export default ({ src, alt, srcSet }) => (
  <img className={styles.image} src={src} alt={alt} srcSet={srcSet} />
);
