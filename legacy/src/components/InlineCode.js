import React from 'react';
import PropTypes from 'prop-types';
import styles from './InlineCode.module.scss';

const InlineCode = ({ children }) => (
  <code className={styles.inlineCode}>{children}</code>
);

InlineCode.displayName = 'InlineCode';

InlineCode.propTypes = {
  children: PropTypes.any,
};

export default InlineCode;
