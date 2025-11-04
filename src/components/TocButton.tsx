import React from 'react';
import * as styles from './TocButton.module.scss';

interface TocButtonProps {
  onClick?: () => void;
  isSelected?: boolean;
}

const TocButton: React.FC<TocButtonProps> = ({ onClick, isSelected = false }) => (
  <div
    className={[styles.button, isSelected ? styles.selected : null]
      .filter(className => className)
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

export default TocButton;