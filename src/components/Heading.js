import PropTypes from 'prop-types';
import React from 'react';
import styles from './Heading.module.scss';

const kebabCase = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

class Heading extends React.Component {
  render() {
    const { level, children } = this.props;

    const name = `${kebabCase(typeof children === 'string' ? children : '')}`;
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
