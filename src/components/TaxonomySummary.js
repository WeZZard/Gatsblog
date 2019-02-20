import React from 'react';
import _ from 'lodash';
import styles from './TaxonomySummary.module.scss';

import Link from './Link';

export default ({ type, taxonomy, posts }) => {
  const baseSlug = getBaseSlug(type);

  const slug = `${baseSlug}/${_.kebabCase(taxonomy)}`;

  const relatedPosts = getRelatedPosts(type, posts, taxonomy);

  const relatedPostComponents = relatedPosts.map((relatedPost, index) => {
    return (
      <li key={index} className={styles.postItem}>
        <div className={styles.postTitleFlexWrapper}>
          <span className={styles.postTitle}>
            <Link to={relatedPost.slug}>{relatedPost.title}</Link>
          </span>
        </div>
      </li>
    );
  });

  return (
    <React.Fragment>
      <div className={styles.taxonomyNameFlexWrapper}>
        <h1 className={styles.taxonomyName}>{taxonomy}</h1>
      </div>
      <div className={styles.postListFlexWrapper}>
        <ul className={styles.postList}>{relatedPostComponents}</ul>
      </div>
      <div className={styles.moreFlexWrapper}>
        <span className={styles.more}>
          <Link kind={'primary'} to={slug}>
            More ...
          </Link>
        </span>
      </div>
    </React.Fragment>
  );
};

const getRelatedPosts = (type, posts, taxonomy, limit = 5) => {
  switch (type) {
    case 'tag':
      posts.sort((p1, p2) => p1.createdTime > p2.createdTime);
      return posts.filter(post => post.tags.includes(taxonomy)).slice(0, limit);
    case 'category':
      posts.sort((p1, p2) => p1.createdTime > p2.createdTime);
      return posts.filter(post => post.category === taxonomy).slice(0, limit);
    default:
      throw `Unexpected taxonomy type: ${type}.`;
  }
};

const getBaseSlug = type => {
  switch (type) {
    case 'tag':
      return 'tag';
    case 'category':
      return 'category';
    default:
      throw `Unexpected taxonomy type: ${type}.`;
  }
};
