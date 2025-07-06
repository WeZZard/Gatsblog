import React from 'react';

interface TableDataProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const TableData: React.FC<TableDataProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default TableData;
