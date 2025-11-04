import React from 'react';

interface SpanProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Span: React.FC<SpanProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Span;
