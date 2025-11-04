import React from 'react';
import * as styles from './SocialBar.module.scss';

interface SocialBarProps {
  isOpen: boolean;
  menuItemDidTap: () => void;
}

// TODO: Implement full SocialBar functionality
const SocialBar: React.FC<SocialBarProps> = ({ isOpen, menuItemDidTap }) => {
  const socialBarClassNames = [styles.social];

  if (isOpen) {
    socialBarClassNames.push(styles.open);
  }

  return (
    <div className={socialBarClassNames.join(' ')}>
      {/* Placeholder for social media links */}
    </div>
  );
};

export default SocialBar;