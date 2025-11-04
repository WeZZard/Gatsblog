import React from 'react';

interface StrongProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Strong: React.FC<StrongProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Strong;
