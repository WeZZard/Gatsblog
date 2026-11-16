import React from 'react';
import styles from './Table.module.scss';

import MDXContext from './MDXContext';
import BlockquoteContext from './BlockquoteContext';

const Table = props => (
  <BlockquoteContext.Consumer>
    {isInBlockquote => (
      <MDXContext.Provider value={'sans'}>
        <div
          className={isInBlockquote ? styles.blockquoteWrapper : styles.wrapper}
        >
          <table className={styles.table} {...props} />
        </div>
      </MDXContext.Provider>
    )}
  </BlockquoteContext.Consumer>
);

Table.displayName = 'Table';

export default Table;
