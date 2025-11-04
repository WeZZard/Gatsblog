import React from 'react';

interface SegmentSeparatorProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const SegmentSeparator: React.FC<SegmentSeparatorProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default SegmentSeparator;
