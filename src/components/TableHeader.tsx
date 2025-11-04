import React from 'react';

interface TableHeaderProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default TableHeader;
