import React from 'react';
import styles from './PostFooter.module.scss';

import MDXMetadata from './MDXMetadata';
import License from './License';

export default ({ tags, license }) => {
  const tagsComponent =
    tags.length > 0 ? (
      <div className={styles.tags}>
        <MDXMetadata items={[{ name: 'tags', data: tags }]} />
      </div>
    ) : null;

  return (
    <React.Fragment>
      {tagsComponent}
      <div className={styles.license}>
        <License license={license} />
      </div>
    </React.Fragment>
  );
};
