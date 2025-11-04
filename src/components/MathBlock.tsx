import React from 'react';

interface MathBlockProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const MathBlock: React.FC<MathBlockProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default MathBlock;
