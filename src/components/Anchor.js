import React from 'react';
import styles from './Anchor.module.scss';

const Anchor = props => <a className={styles.link} {...props} />;

Anchor.displayName = 'Anchor';

export default Anchor;
