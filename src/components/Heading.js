import assert from 'assert';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './Heading.module.scss';

// Simple kebab-case implementation to avoid lodash circular reference issues
const kebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

class Heading extends React.Component {
  render() {
    const { level, children } = this.props;
    assert(level >= 1 && level <= 6);

    const name = `${kebabCase(children)}`;
    const Component = `h${level}`;

    return (
      <Component className={styles.h}>
        <span id={name} className={styles[`h${level}`]}>
          {children}
        </span>
      </Component>
    );
  }
}

Heading.propTypes = {
  children: PropTypes.any,
  level: PropTypes.number,
};

export default Heading;
