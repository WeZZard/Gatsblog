import React from 'react';

interface BlockquoteProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Blockquote: React.FC<BlockquoteProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Blockquote;
