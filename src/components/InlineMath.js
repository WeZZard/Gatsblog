import React from 'react';
import styles from './InlineMath.module.scss';

let katex = null;
try {
  katex = require('katex');
} catch (e) {
  // katex may be null-loaded during SSR
}

const InlineMath = ({ math, children }) => {
  const expression = math || (typeof children === 'string' ? children : '');
  if (katex) {
    try {
      const html = katex.renderToString(expression, {
        displayMode: false,
        throwOnError: false,
      });
      return (
        <span
          className={styles.inlineMath}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch (e) {
      return <span className={styles.inlineMath}>{expression}</span>;
    }
  }
  return <span className={styles.inlineMath}>{expression}</span>;
};

InlineMath.displayName = 'InlineMath';

export default InlineMath;
