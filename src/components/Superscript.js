import React from 'react';
import PropTypes from 'prop-types';
import styles from './Superscript.module.scss';

import Anchor from './Anchor';

import { normalizeChildren, processChildren } from '../utils';

const Superscript = ({ id, children }) => {
  const normalizedChildren = normalizeChildren(children);
  const processedChildren = processChildren(normalizedChildren, { a });
  return (
    <sup className={styles.superscript} id={id}>
      {processedChildren}
    </sup>
  );
};

Superscript.propTypes = {
  children: PropTypes.any,
  id: PropTypes.string,
};

export default Superscript;

const a = (child, index) => {
  const {
    children,
    props: { href },
  } = child.props;
  return (
    <Anchor key={index} href={href}>
      {children}
    </Anchor>
  );
};
