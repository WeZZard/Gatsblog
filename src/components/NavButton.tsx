import React from 'react';
import * as styles from './NavButton.module.scss';

interface NavButtonProps {
  onClick?: () => void;
  isSelected?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ onClick, isSelected = false }) => (
  <div
    className={[styles.button, isSelected ? styles.selected : null]
      .filter(className => className)
      .join(' ')}
    onClick={onClick}
  >
    <div className={styles.burger}>
      <div className={styles.topBar} />
      <div className={styles.bottomBar} />
    </div>
  </div>
);

export default NavButton;