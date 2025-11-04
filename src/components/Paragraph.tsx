import React from 'react';

interface ParagraphProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Paragraph: React.FC<ParagraphProps> = ({ children, ...props }) => {
  return <p {...props}>{children}</p>;
};

export default Paragraph;