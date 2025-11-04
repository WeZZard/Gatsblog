import React from 'react';

interface InlineMathProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const InlineMath: React.FC<InlineMathProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default InlineMath;
