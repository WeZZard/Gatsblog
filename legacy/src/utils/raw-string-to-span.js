import Span from '../components/Span';
import React from 'react';

const rawStringToSpan = (string, index) => {
  return <Span key={index}>{string}</Span>;
};

rawStringToSpan.displayName = 'Span';

export default rawStringToSpan;
