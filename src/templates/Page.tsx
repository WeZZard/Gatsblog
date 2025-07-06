import React from 'react';
import { graphql, PageProps } from 'gatsby';
import * as styles from './Page.module.scss';

import { StaticPageContext } from '../types/page-generation';
import Main from '../components/Main';
import Title from '../components/Title';
import MDXBody from '../components/MDXBody';

interface PageQueryData {
  page: {
    lang: string;
    title: string;
    subtitle?: string;
    createdTime: string;
    category?: string;
    keywords?: string[];
    file: {
      childMdx: {
        excerpt: string;
        code: {
          body: string;
          scope: Record<string, any>;
        };
        headings: Array<{
          value: string;
          depth: number;
        }>;
      };
    };
  };
  site: {
    siteMetadata: {
      title: string;
      description: string;
    };
  };
}

type PageProps_ = PageProps<PageQueryData, StaticPageContext>;

const Page: React.FC<PageProps_> = ({ data, pageContext }) => {
  const { pageId } = pageContext;
  const { page, site } = data;

  if (!page) {
    return null;
  }

  const {
    lang,
    title,
    subtitle,
    createdTime,
    keywords,
    file: {
      childMdx: { excerpt, code, headings },
    },
  } = page;

  const sections = (
    <article className={styles.page}>
      <header className={styles.pageHeader}>
        <Title title={title} subtitle={subtitle} />
        <div className={styles.pageMetadata}>
          <time dateTime={createdTime}>{createdTime}</time>
        </div>
      </header>

      <MDXBody 
        textStyle="page"
        code={code}
      />
    </article>
  );

  return (
    <Main
      slug={`/page/${pageId}`}
      lang={lang}
      title={title}
      description={excerpt}
      keywords={keywords || []}
      headings={headings}
      sections={sections}
      layout="Content"
    />
  );
};

export default Page;

export const query = graphql`
  query PageQuery($pageId: String!) {
    page(id: { eq: $pageId }) {
      lang
      title
      subtitle
      createdTime(formatString: "MMMM DD, YYYY")
      keywords
      file {
        childMdx {
          excerpt(pruneLength: 160)
          code {
            body
            scope
          }
          headings {
            value
            depth
          }
        }
      }
    }
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;