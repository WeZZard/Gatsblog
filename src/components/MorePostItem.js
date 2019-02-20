import React from 'react';
import styles from './MorePostItem.module.scss';

import PostExcerptMetadata from './PostExcerptMetadata';
import Link from './Link';

export default ({ info }) => {
  const { title, item } = info;

  const subtitleComponent =
    item.subtitle !== '' ? (
      <div className={styles.subtitle}>
        <h2>{item.subtitle}</h2>
      </div>
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
      <div className={styles.caption}>
        <span className={styles.captionContent}>{title}</span>
      </div>
      <div className={styles.postExcerpt}>
        <section className={styles.header}>
          <Link kind={'header'} to={item.slug}>
            <div className={styles.title}>
              <h1>{item.title}</h1>
            </div>
            {subtitleComponent}
          </Link>
        </section>
        {content}
        <section className={styles.footer}>
          <PostExcerptMetadata post={item} />
        </section>
      </div>
    </div>
  );
};
