import React from 'react';
import styles from './Page.module.scss';
import PropTypes from 'prop-types';

import { graphql } from 'gatsby';

import Main from '../components/Main';
import Title from '../components/Title';
import MDXMetadata from '../components/MDXMetadata';
import MDXBody from '../components/MDXBody';

class Page extends React.Component {
  render() {
    const { data } = this.props;
    const { page } = data;

    const {
      slug,
      title,
      subtitle,
      createdTime,
      keywords,
      lang,
      file,
    } = page;

    // Handle Markdown files (using childMarkdownRemark)
    const excerpt = file?.childMarkdownRemark?.excerpt || '';
    const body = file?.childMarkdownRemark?.html || '';

    const article = (
      <article className={styles.page}>
        <header className={styles.header}>
          <Title textStyle={'sans'} title={title} subtitle={subtitle} />
          <aside className={styles.metadata}>
            <MDXMetadata items={[{ name: 'time', data: createdTime }]} />
          </aside>
        </header>
        <section className={styles.main}>
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </section>
      </article>
    );

    return (
      <Main
        slug={slug}
        lang={lang}
        title={page.title}
        sections={article}
        keywords={keywords}
        description={excerpt}
      />
    );
  }
}

Page.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
};

export default Page;

export const pageQuery = graphql`
  query PageQuery($pageId: String!) {
    page(id: { eq: $pageId }) {
      title
      slug
      subtitle
      isPublished
      createdTime
      lastModifiedTime
      license
      file {
        childMarkdownRemark {
          excerpt(pruneLength: 300)
          html
        }
      }
    }
  }
`;
