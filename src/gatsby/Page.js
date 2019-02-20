import React from 'react';
import PropTypes from 'prop-types';

class Page extends React.Component {}

Page.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
};

export default Page;
