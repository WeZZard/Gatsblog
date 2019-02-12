import React from 'react';
import styles from './Image.module.scss'
import { edgesWithGridSystem } from '../utils'

export default props => {
    const {
        src,
        alt,
        srcSet
    } = props;

    const className = edgesWithGridSystem({
        style: styles.image,
        top: 'rect',
        bottom: 'rect',
    });

    return <img className={className} src={src} alt={alt} srcSet={srcSet}/>
}
