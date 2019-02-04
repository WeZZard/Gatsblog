import React from 'react';

export default (props) => {
    const {
        src,
        alt,
        srcSet
    } = props;
    return <img className={'geometryBlockTop geometryBlockBottom'} src={src} alt={alt} srcSet={srcSet}/>
}
