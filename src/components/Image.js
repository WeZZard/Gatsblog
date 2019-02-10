import React from 'react';

export default (props) => {
    const {
        src,
        alt,
        srcSet
    } = props;
    return <img className={'rectTop rectBottom'} src={src} alt={alt} srcSet={srcSet}/>
}
