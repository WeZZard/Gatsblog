import React from 'react';
import Helmet from 'react-helmet';

export default () => {
  return (
    <Helmet>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"
      />
    </Helmet>
  );
};
