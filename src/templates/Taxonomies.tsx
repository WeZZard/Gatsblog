import React from 'react';
import { graphql, PageProps } from 'gatsby';
import * as styles from './Taxonomies.module.scss';

import { TaxonomyIndexPageContext } from '../types/page-generation';
import Main from '../components/Main';
import Title from '../components/Title';
import Paginator from '../components/Paginator';

interface TaxonomiesQueryData {
  site: {
    siteMetadata: {
      title: string;
      description: string;
    };
  };
}

type TaxonomiesProps = PageProps<TaxonomiesQueryData, TaxonomyIndexPageContext>;

const Taxonomies: React.FC<TaxonomiesProps> = ({ data, pageContext }) => {
  const {
    type,
    slug,
    locale,
    componentName,
    title,
    showsPageTitle,
    keywords,
    description,
    taxonomies,
    paginationInfo,
  } = pageContext;

  const { site } = data;

  const sections = (
    <article className={styles.taxonomies}>
      {showsPageTitle && title && (
        <Title title={title} />
      )}
      
      <div className={styles.taxonomiesList}>
        {taxonomies.map((taxonomy, index) => (
          <div key={index} className={styles.taxonomyItem}>
            <h3 className={styles.taxonomyName}>{taxonomy}</h3>
            {/* TODO: Add link to individual taxonomy page */}
          </div>
        ))}
      </div>

      <Paginator 
        paginationInfo={{
          ...paginationInfo,
          currentPage: paginationInfo.pageIndex + 1,
          pageCount: paginationInfo.pagesCount,
          hasNextPage: paginationInfo.pageIndex < paginationInfo.pagesCount - 1,
          hasPreviousPage: paginationInfo.pageIndex > 0,
        }} 
      />
    </article>
  );

  return (
    <Main
      slug={slug}
      lang={locale?.identifier}
      title={title || `${type.charAt(0).toUpperCase() + type.slice(1)} Index`}
      description={description}
      keywords={keywords}
      sections={sections}
      layout="Content"
    />
  );
};

export default Taxonomies;

export const query = graphql`
  query TaxonomiesQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;