import React from 'react';

interface HeadingProps {
  level: number;
  children?: React.ReactNode;
  [key: string]: any;
}

const Heading: React.FC<HeadingProps> = ({ level, children, ...props }) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  return <HeadingTag {...props}>{children}</HeadingTag>;
};

export default Heading;