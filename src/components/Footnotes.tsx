import React from 'react';

interface FootnotesProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Footnotes: React.FC<FootnotesProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Footnotes;
