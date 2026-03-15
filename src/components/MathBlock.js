import React from 'react';
import styles from './MathBlock.module.scss';

let katex = null;
try {
  katex = require('katex');
} catch (e) {
  // katex may be null-loaded during SSR
}

const MathBlock = ({ math, children }) => {
  const expression = math || (typeof children === 'string' ? children : '');
  if (katex) {
    try {
      const html = katex.renderToString(expression, {
        displayMode: true,
        throwOnError: false,
      });
      return (
        <pre className={styles.math}>
          <span dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      );
    } catch (e) {
      return <pre className={styles.math}>{expression}</pre>;
    }
  }
  return <pre className={styles.math}>{expression}</pre>;
};

MathBlock.displayName = 'MathBlock';

export default MathBlock;
