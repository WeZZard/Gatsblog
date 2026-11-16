import React from 'react';
import styles from './Blockquote.module.scss';

import BlockquoteContext from './BlockquoteContext';

const Blockquote = props => (
  <BlockquoteContext.Provider value={true}>
    <blockquote className={styles.blockquote} {...props} />
  </BlockquoteContext.Provider>
);

export default Blockquote;
