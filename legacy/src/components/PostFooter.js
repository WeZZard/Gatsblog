import React from 'react';
import PropTypes from 'prop-types';
import styles from './PostFooter.module.scss';

import MDXMetadata from './MDXMetadata';
import License from './License';

const PostFooter = ({ tags, license }) => {
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

PostFooter.propTypes = {
  license: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default PostFooter;
