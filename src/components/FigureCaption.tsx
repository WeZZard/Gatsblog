import React from 'react';

interface FigureCaptionProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const FigureCaption: React.FC<FigureCaptionProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default FigureCaption;
