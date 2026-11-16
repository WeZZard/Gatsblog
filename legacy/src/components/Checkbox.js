import React from 'react';
import styles from './Checkbox.module.scss';

const Checkbox = props => <input className={styles.checkbox} {...props} />;

Checkbox.displayName = 'Checkbox';

export default Checkbox;
