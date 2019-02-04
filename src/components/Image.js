import React from 'react';

export default (props) => {
    const {
        src,
        alt,
        srcSet
    } = props;
    return <img src={src} alt={alt} srcSet={srcSet}/>
}
