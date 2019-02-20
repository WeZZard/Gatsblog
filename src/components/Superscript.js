import React from 'react';
import styles from './Superscript.module.scss';

import Anchor from './Anchor';

import { normalizeChildren, processChildren } from '../utils';

export default ({ id, children }) => {
  const normalizedChildren = normalizeChildren(children);
  const processedChildren = processChildren(normalizedChildren, { a });
  return (
    <sup className={styles.superscript} id={id}>
      {processedChildren}
    </sup>
  );
};

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
