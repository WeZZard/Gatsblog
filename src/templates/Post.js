import React from 'react';
import styles from './Post.module.scss';
import PropTypes from 'prop-types';

import { graphql } from 'gatsby';

import Main from '../components/Main';
import Title from '../components/Title';
import MDXMetadata from '../components/MDXMetadata';
import MDXBody from '../components/MDXBody';
import PostFooter from '../components/PostFooter';
import MorePosts from '../components/MorePosts';

const Post = ({ data, children }) => {
  const { post, earlierPostExcerpt, laterPostExcerpt } = data;

  const {
    lang,
    title,
    subtitle,
    createdTime,
    category,
    tags,
    keywords,
    license,
    file,
  } = post;

  const excerpt = file && file.childMdx ? file.childMdx.excerpt : '';
  const headings = file && file.childMdx ? file.childMdx.tableOfContents : null;

  const tocHeadings = headings && headings.items
    ? flattenTableOfContents(headings.items)
    : [];

  const article = (
    <article className={styles.post}>
      <header className={styles.header}>
        <Title textStyle={'serif'} title={title} subtitle={subtitle} />
        <aside className={styles.metadata}>
          <MDXMetadata
            items={[
              { name: 'time', data: createdTime },
              { name: 'category', data: category },
            ]}
          />
        </aside>
      </header>
      <main className={styles.main}>
        <MDXBody textStyle={'serif'}>{children}</MDXBody>
      </main>
      <footer className={styles.footer}>
        <PostFooter tags={tags} license={license} />
      </footer>
    </article>
  );

  const moreItems =
    earlierPostExcerpt || laterPostExcerpt ? (
      <MorePosts
        earlierPostExcerpt={earlierPostExcerpt}
        laterPostExcerpt={laterPostExcerpt}
      />
    ) : null;

  const allKeywords = [category, ...tags, ...(keywords ? keywords : [])];

  return (
    <Main
      lang={lang}
      title={post.title}
      keywords={allKeywords}
      description={excerpt}
      headings={tocHeadings}
      sections={[article, moreItems].filter(_ => _)}
    />
  );
};

function flattenTableOfContents(items, depth = 0) {
  const result = [];
  for (const item of items) {
    result.push({ value: item.title, depth: depth + 2 });
    if (item.items) {
      result.push(...flattenTableOfContents(item.items, depth + 1));
    }
  }
  return result;
}

Post.propTypes = {
  data: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default Post;

export const pageQuery = graphql`
  query PostQuery(
    $postId: String!
    $earlierPostId: String
    $laterPostId: String
  ) {
    post(id: { eq: $postId }) {
      title
      subtitle
      isPublished
      createdTime
      lastModifiedTime
      license
      tags
      category
      lang
      keywords
      file {
        childMdx {
          excerpt(pruneLength: 100)
          tableOfContents
        }
      }
    }
    earlierPostExcerpt: post(id: { eq: $earlierPostId }) {
      slug
      title
      subtitle
      createdTime
      tags
      category
      file {
        childMdx {
          excerpt(pruneLength: 300)
        }
      }
    }
    laterPostExcerpt: post(id: { eq: $laterPostId }) {
      slug
      title
      subtitle
      createdTime
      tags
      category
      file {
        childMdx {
          excerpt(pruneLength: 300)
        }
      }
    }
  }
`;
