import React from 'react';
import styles from './Paragraph.module.scss'

export default (props) => <p
    className={[styles.paragraph, 'serifTop', 'serifBottom'].join(' ')}
    {...props}
/>
