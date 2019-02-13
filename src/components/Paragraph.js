import React from 'react';
import styles from './Paragraph.module.scss'
import { edgesWithGridSystem } from '../utils';

export default props => {
    const {
        textStyle = 'serif'
    } = props;

    const className = edgesWithGridSystem({
        style: styles.paragraph,
        top: textStyle,
        bottom: textStyle
    });

    const standardProps = {
        ...props
    };
    delete standardProps.textStyle;

    return <p className={className} {...standardProps}/>
}
