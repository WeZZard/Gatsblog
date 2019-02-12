import React from 'react';
import styles from './Image.module.scss'

export default (props) => {
    const {
        src,
        alt,
        srcSet
    } = props;
    return <img
        className={[styles.image, 'rectTop', 'rectBottom'].join(' ')}
        src={src}
        alt={alt}
        srcSet={srcSet}
    />
}
