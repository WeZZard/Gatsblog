import React from 'react';

interface ContentsProps {
  sections?: React.ReactNode;
}

const Contents: React.FC<ContentsProps> = ({ sections }) => {
  return <div>{sections}</div>;
};

export default Contents;