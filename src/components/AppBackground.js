import React from 'react';
import PropTypes from 'prop-types';
import styles from './AppBackground.module.scss';

const AppBackground = ({ backgroundPosition }) => {
  // Defensive check to avoid circular reference issues with CSS modules during SSR
  const safeStyles = styles || {};
  
  const classNames = [safeStyles.appBackground || 'app-background'];

  switch (backgroundPosition) {
    case 'Center':
      classNames.push(safeStyles.center || 'center');
      break;
    case 'Left':
      classNames.push(safeStyles.left || 'left');
      break;
    default:
      throw `Unexpected background-position: ${backgroundPosition}`;
  }

  const className = classNames.join(' ');

  return (
    <div className={className}>
      <div className={safeStyles.overlay || 'overlay'} />
    </div>
  );
};

AppBackground.propTypes = {
  backgroundPosition: PropTypes.string.isRequired,
};

export default AppBackground;
