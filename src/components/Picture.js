import React from 'react';
import styles from './Picture.module.scss';

const Picture = props => <picture className={styles.picture} {...props} />;
Picture.displayName = 'Picture';

export default Picture;
