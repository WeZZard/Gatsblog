import Span from '../components/Span';
import React from 'react';

export default (string, index) => {
  return <Span key={index}>{string}</Span>;
};
