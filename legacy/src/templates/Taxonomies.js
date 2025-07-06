import React from 'react';
import styles from './Taxonomies.module.scss';
import PropTypes from 'prop-types';

import Main from '../components/Main';
import Title from '../components/Title';
import Paginator from '../components/Paginator';
import TaxonomySummary from '../components/TaxonomySummary';

import { graphql } from 'gatsby';

class Taxonomies extends React.Component {
  render() {
    const { data, pageContext } = this.props;
    const {
      type,
      slug,
      taxonomies,
      paginationInfo,
      title,
      subtitle,
      showsPageTitle,
      description,
      keywords,
    } = pageContext;

    const postNodes = getPostNodes(type, data);

    const posts = postNodes.map(postNode => postNode.node);

    const header = showsPageTitle ? (
      <header className={styles.header}>
        <Title title={title} subtitle={subtitle} />
      </header>
    ) : null;

    taxonomies.sort((t1, t2) => t1 > t2);

    const components = taxonomies.map((taxonomy, index) => (
      <div key={index} className={styles.taxonomySummary}>
        {React.createElement(TaxonomySummary, {
          type,
          taxonomy,
          posts,
        })}
      </div>
    ));

    const contents = (
      <div className={styles.index}>
        {header}
        <main>{components}</main>
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

Taxonomies.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
};

export default Taxonomies;

const getPostNodes = (type, data) => {
  switch (type) {
    case 'category': {
      const { category } = data;
      const { edges: postNodesForCategory } = category || { edges: [] };
      return postNodesForCategory;
    }
    case 'tag': {
      const { tags } = data;
      const { edges: postNodesForTags } = tags || { edges: [] };
      return postNodesForTags;
    }
    default:
      throw `Unexpected taxonomy type: ${type}`;
  }
};

export const pageQuery = graphql`
  query TaxonomiesQuery($taxonomies: [String!]!) {
    category: allPost(filter: { category: { in: $taxonomies } }) {
      edges {
        node {
          slug
          title
          subtitle
          isPublished
          createdTime
          category
        }
      }
    }
    tags: allPost(filter: { tags: { in: $taxonomies } }) {
      edges {
        node {
          slug
          title
          subtitle
          isPublished
          createdTime
          tags
        }
      }
    }
  }
`;
