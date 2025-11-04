import React from 'react';

interface AppBackgroundProps {
  backgroundPosition?: string;
}

const AppBackground: React.FC<AppBackgroundProps> = ({ backgroundPosition }) => {
  // TODO: Implement app background based on position
  return <div className="app-background" data-position={backgroundPosition} />;
};

export default AppBackground;