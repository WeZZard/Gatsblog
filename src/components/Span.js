import React from 'react';
import PropTypes from 'prop-types';
import styles from './Span.module.scss';

const Span = props => {
  const { children } = props;
  return <span className={styles.span}>{children}</span>;
};

Span.displayName = 'Span';

Span.propTypes = {
  children: PropTypes.any,
};

export default Span;
