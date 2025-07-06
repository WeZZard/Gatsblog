import React from 'react';
import styles from './Index.module.scss';
import PropTypes from 'prop-types';

import Main from '../components/Main';
import Title from '../components/Title';
import PostExcerpt from '../components/PostExcerpt';
import Paginator from '../components/Paginator';

import { graphql } from 'gatsby';

class Index extends React.Component {
  render() {
    const { data, pageContext } = this.props;
    
    // Defensive check to avoid circular reference issues with CSS modules during SSR
    const safeStyles = styles || {};
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
      <header className={safeStyles.header || 'header'}>
        <Title title={title} subtitle={subtitle} />
      </header>
    ) : null;

    const contents = (
      <div className={safeStyles.index || 'index'}>
        {header}
        <main className={safeStyles.main || 'main'}>
          {posts.map((post, index) => (
            <div key={index} className={safeStyles.postExcerpt || 'post-excerpt'}>
              {React.createElement(PostExcerpt, { item: post })}
            </div>
          ))}
        </main>
        <div className={safeStyles.paginator || 'paginator'}>
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

Index.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
};

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
            childMarkdownRemark {
              excerpt(pruneLength: 300)
            }
          }
        }
      }
    }
  }
`;
