import React from 'react';

interface SuperscriptProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Superscript: React.FC<SuperscriptProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Superscript;
