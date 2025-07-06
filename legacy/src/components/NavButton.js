import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavButton.module.scss';

const NavButton = ({ onClick, isSelected }) => (
  <div
    className={[styles.button, isSelected ? styles.selected : null]
      .filter(_ => _)
      .join(' ')}
    onClick={onClick}
  >
    <div className={styles.burger}>
      <div className={styles.topBar} />
      <div className={styles.bottomBar} />
    </div>
  </div>
);

NavButton.propTypes = {
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};

NavButton.displayName = 'NavButton';

export default NavButton;
