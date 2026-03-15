import React from 'react';

const Taxonomies = ({ pageContext }) => {
  return (
    <div>
      <h1>{pageContext.title || 'Taxonomies'}</h1>
    </div>
  );
};

export default Taxonomies;
