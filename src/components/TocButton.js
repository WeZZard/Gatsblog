import React from 'react';
import styles from './TocButton.module.scss';

export default ({ onClick, isOpen }) => (
  <div
    className={[styles.button, isOpen ? styles.open : null]
      .filter(_ => _)
      .join(' ')}
    onClick={onClick}
  >
    <div className={styles.leftArrow}>
      <div className={styles.topLine} />
      <div className={styles.bottomLine} />
    </div>
    <div className={styles.rightArrow}>
      <div className={styles.topLine} />
      <div className={styles.bottomLine} />
    </div>
  </div>
);
