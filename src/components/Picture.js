import React from 'react';
import styles from './Picture.module.scss';

const Picture = props => {
  const newProps = { ...props };
  delete newProps.parentName;
  return <picture className={styles.picture} {...newProps} />;
};
Picture.displayName = 'Picture';

export default Picture;
