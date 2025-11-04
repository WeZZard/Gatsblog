import React from 'react';

interface AnchorProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Anchor: React.FC<AnchorProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Anchor;
