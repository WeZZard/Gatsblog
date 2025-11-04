import React from 'react';

interface TableProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Table: React.FC<TableProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default Table;
