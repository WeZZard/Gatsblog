import React from 'react';
import styles from './Span.module.scss';

const Span = props => <span className={styles.span} {...props} />;

Span.displayName = 'Span';

export default Span;
