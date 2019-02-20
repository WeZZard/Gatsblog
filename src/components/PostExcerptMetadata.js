import React from 'react';
import assert from 'assert';
import styles from './PostExcerptMetadata.module.scss';

import MDXMetadata from './MDXMetadata';

export default ({ post }) => {
  const createdTime = { name: 'time', data: post.createdTime };

  const category = post.category
    ? { name: 'category', data: post.category }
    : null;

  const tags = post.tags.length > 0 ? { name: 'tags', data: post.tags } : null;

  const lines = [[createdTime, category], [tags]];

  const filteredLines = lines.filter(line => {
    assert(Array.isArray(line));
    const filteredLine = line.filter(item => item);
    return filteredLine.length;
  });

  return (
    <React.Fragment>
      {filteredLines.map((items, lineNumber) => (
        <div className={styles.line} key={lineNumber}>
          <MDXMetadata items={items} />
        </div>
      ))}
    </React.Fragment>
  );
};
