import React from 'react';

interface PreFormattedBlockProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const PreFormattedBlock: React.FC<PreFormattedBlockProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default PreFormattedBlock;
