import React from 'react';

interface ListProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const List: React.FC<ListProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default List;
