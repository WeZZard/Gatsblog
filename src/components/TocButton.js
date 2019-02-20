import React from 'react';
import PropTypes from 'prop-types';
import styles from './TocButton.module.scss';

const TocButton = ({ onClick, isOpen }) => (
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

TocButton.propTypes = {
  onClick: PropTypes.function,
  isOpen: PropTypes.bool,
};

TocButton.displayName = 'TocButton';

export default TocButton;
