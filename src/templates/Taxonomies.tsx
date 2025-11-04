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

  const header = showsPageTitle && title ? (
    <header className={styles.header}>
      <Title title={title} />
    </header>
  ) : null;

  const sections = (
    <div className={styles.index}>
      {header}
      <main>
        {taxonomies.map((taxonomy, index) => (
          <div key={index} className={styles.taxonomySummary}>
            <h3>{taxonomy}</h3>
            {/* TODO: Add link to individual taxonomy page */}
          </div>
        ))}
      </main>
      <div className={styles.paginator}>
        <Paginator 
          paginationInfo={{
            ...paginationInfo,
            currentPage: paginationInfo.pageIndex + 1,
            pageCount: paginationInfo.pagesCount,
            hasNextPage: paginationInfo.pageIndex < paginationInfo.pagesCount - 1,
            hasPreviousPage: paginationInfo.pageIndex > 0,
          }} 
        />
      </div>
    </div>
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