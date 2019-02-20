import React from 'react';
import styles from './Index.module.scss';

import GatsbyPage from '../gatsby/Page';
import Main from '../components/Main';
import Title from '../components/Title';
import PostExcerpt from '../components/PostExcerpt';
import Paginator from '../components/Paginator';

import { graphql } from 'gatsby';

class Index extends GatsbyPage {
  render() {
    const { data, pageContext } = this.props;
    const {
      slug,
      paginationInfo,
      title,
      subtitle,
      showsPageTitle,
      description,
      keywords,
    } = pageContext;

    const { allPost } = data;

    const { edges: postNodes } = allPost || { edges: [] };

    const posts = postNodes.map(postNode => postNode.node);
    posts.sort((p1, p2) => p1.createdTime < p2.createdTime);

    const header = showsPageTitle ? (
      <header className={styles.header}>
        <Title title={title} subtitle={subtitle} />
      </header>
    ) : null;

    const contents = (
      <div className={styles.index}>
        {header}
        <main className={styles.main}>
          {posts.map((post, index) => (
            <div key={index} className={styles.postExcerpt}>
              {React.createElement(PostExcerpt, { item: post })}
            </div>
          ))}
        </main>
        <div className={styles.paginator}>
          <Paginator paginationInfo={paginationInfo} />
        </div>
      </div>
    );

    return (
      <Main
        slug={slug}
        title={title}
        description={description}
        keywords={keywords}
        sections={contents}
      />
    );
  }
}

export default Index;

export const pageQuery = graphql`
  query IndexQuery($items: [String!]!) {
    allPost(filter: { id: { in: $items } }) {
      edges {
        node {
          slug
          title
          subtitle
          isPublished
          createdTime
          lastModifiedTime
          license
          tags
          category
          file {
            childMdx {
              excerpt(pruneLength: 300)
            }
          }
        }
      }
    }
  }
`;
