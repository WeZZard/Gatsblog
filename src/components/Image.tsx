import React from 'react';

interface ImageProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Image: React.FC<ImageProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Image;
