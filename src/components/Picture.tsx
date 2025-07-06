import React from 'react';

interface PictureProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Picture: React.FC<PictureProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Picture;
