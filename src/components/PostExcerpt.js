import React from 'react';
import styles from './PostExcerpt.module.scss';

import PostExcerptMetadata from './PostExcerptMetadata';
import Link from './Link';

export default ({ item }) => {
  const subtitleComponent =
    item.subtitle !== '' ? (
      <h2 className={styles.subtitle}>{item.subtitle}</h2>
    ) : null;

  const excerpt = item.file.childMdx.excerpt;

  const content = excerpt ? (
    <section className={styles.content}>
      <p className={styles.paragraph}>
        <Link
          kind={'summary'}
          to={item.slug}
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      </p>
    </section>
  ) : null;

  return (
    <div className={styles.flexWrapper}>
      <section className={styles.header}>
        <Link kind={'header'} to={item.slug}>
          <h1 className={styles.title}>{item.title}</h1>
          {subtitleComponent}
        </Link>
      </section>
      {content}
      <section className={styles.footer}>
        <PostExcerptMetadata post={item} />
      </section>
    </div>
  );
};
