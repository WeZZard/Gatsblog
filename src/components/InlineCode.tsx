import React from 'react';

interface InlineCodeProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const InlineCode: React.FC<InlineCodeProps> = ({ children, ...props }) => {
  return <code {...props}>{children}</code>;
};

export default InlineCode;