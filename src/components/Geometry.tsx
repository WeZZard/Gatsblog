import React from 'react';

interface GeometryProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Geometry: React.FC<GeometryProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Geometry;
