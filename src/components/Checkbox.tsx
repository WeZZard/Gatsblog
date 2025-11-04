import React from 'react';

interface CheckboxProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Checkbox: React.FC<CheckboxProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Checkbox;
