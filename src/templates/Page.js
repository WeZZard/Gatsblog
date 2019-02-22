import React from 'react';
import styles from './Page.module.scss';

import { graphql } from 'gatsby';

import GatsbyPage from '../gatsby/Page';
import Main from '../components/Main';
import Title from '../components/Title';
import MDXMetadata from '../components/MDXMetadata';
import MDXBody from '../components/MDXBody';

class Page extends GatsbyPage {
  render() {
    const { data } = this.props;
    const { page } = data;

    const {
      slug,
      title,
      subtitle,
      createdTime,
      file: {
        childMdx: { code },
      },
    } = page;

    const article = (
      <article className={styles.page}>
        <header className={styles.header}>
          <Title textStyle={'sans'} title={title} subtitle={subtitle} />
          <aside className={styles.metadata}>
            <MDXMetadata items={[{ name: 'time', data: createdTime }]} />
          </aside>
        </header>
        <main className={styles.main}>
          <MDXBody textStyle={'sans'} code={code} />
        </main>
      </article>
    );

    return <Main slug={slug} title={page.title} sections={article} />;
  }
}

export default Page;

export const pageQuery = graphql`
  query PageQuery($pageId: String!) {
    config {
      site {
        lang
      }
    }
    page(id: { eq: $pageId }) {
      title
      slug
      subtitle
      isPublished
      createdTime
      lastModifiedTime
      license
      file {
        childMdx {
          code {
            body
            scope
          }
        }
      }
    }
  }
`;
