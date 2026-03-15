import React from 'react';
import PropTypes from 'prop-types';

class Main extends React.Component {
  render() {
    const { sections } = this.props;
    return <div>{typeof sections === 'string' ? sections : null}</div>;
  }
}

Main.defaultProps = {
  layout: 'Content',
};

Main.propTypes = {
  description: PropTypes.string,
  headings: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  lang: PropTypes.string,
  sections: PropTypes.any,
  slug: PropTypes.string,
  title: PropTypes.string,
  layout: PropTypes.string,
};

export default Main;
