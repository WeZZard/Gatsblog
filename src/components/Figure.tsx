import React from 'react';

interface FigureProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Figure: React.FC<FigureProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Figure;
