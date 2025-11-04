import React from 'react';
import PropTypes from 'prop-types';
import styles from './Image.module.scss';

const Image = ({ src, alt, srcSet, sizes }) => {
  return (
    <img
      className={styles.image}
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
    />
  );
};

Image.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string,
  srcSet: PropTypes.arrayOf(PropTypes.string),
  sizes: PropTypes.string,
};

export default Image;
