import React from 'react';
import PropTypes from 'prop-types';
import styles from './AppBackground.module.scss';

const AppBackground = ({ backgroundPosition }) => {
  const classNames = [styles.appBackground];

  switch (backgroundPosition) {
    case 'Center':
      classNames.push(styles.center);
      break;
    case 'Left':
      classNames.push(styles.left);
      break;
    default:
      throw `Unexpected background-position: ${backgroundPosition}`;
  }

  const className = classNames.join(' ');

  return (
    <div className={className}>
      <div className={styles.overlay} />
    </div>
  );
};

AppBackground.propTypes = {
  backgroundPosition: PropTypes.string.isRequired,
};

export default AppBackground;
