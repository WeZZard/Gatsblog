import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavButton.module.scss';

const NavButton = ({ onClick, isSelected }) => {
  // Defensive check to avoid circular reference issues with CSS modules during SSR
  const safeStyles = styles || {};
  
  return (
    <div
      className={[safeStyles.button || 'button', isSelected ? safeStyles.selected || 'selected' : null]
        .filter(_ => _)
        .join(' ')}
      onClick={onClick}
    >
      <div className={safeStyles.burger || 'burger'}>
        <div className={safeStyles.topBar || 'top-bar'} />
        <div className={safeStyles.bottomBar || 'bottom-bar'} />
      </div>
    </div>
  );
};

NavButton.propTypes = {
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};

NavButton.displayName = 'NavButton';

export default NavButton;
