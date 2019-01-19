import React from 'react'
import { Link, graphql } from 'gatsby'

import SEO from '../components/SEO'
import Main from '../components/Main'
import ExcerptMetadata from '../components/ExcerptMetadata'
import styles from './index.module.scss'

export default ({data}) => {
    const posts = data.allMarkdownRemark.edges;

    return <Main>
        <SEO title="All posts" keywords={[`blog`, `gatsby`, `javascript`, `react`]} />
        {posts.map(({ node: post }) => {
            return <section key={post.fields.slug}>
                <header className={styles.excerptHeader}>
                    <Link to={post.fields.slug}>
                        <h1>{post.fields.title}</h1>
                        { post.fields.subtitle !== "" ? <h2>{post.fields.subtitle}</h2> : null}
                    </Link>
                </header>
                <section className={styles.excerptBody}>
                    <Link to={post.fields.slug}>
                        <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                    </Link>
                </section>
                <footer className={styles.excerptFooter}>
                    <ExcerptMetadata post={post}/>
                </footer>
            </section>
        })}
    </Main>
};

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(sort: { fields: [fields___birthTime], order: DESC }) {
            edges {
                node {
                    fields {
                        title
                        subtitle
                        birthTime(formatString: "MMMM DD, YYYY")
                        tags
                        category
                        slug
                    }
                    excerpt
                }
            }
        }
    }
`;
