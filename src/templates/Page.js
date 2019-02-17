import React from "react";
import styles from './Post.module.scss';

import { graphql } from 'gatsby';

import Main from '../components/Main'
import MDXHeader from '../components/MDXHeader';
import MDXBody from "../components/MDXBody";

class Page extends React.Component {
    render() {
        const { data } = this.props;
        const { page } = data;

        const {
            title,
            subtitle,
            createdTime,
            file: {
                childMdx: {
                    code,
                },
            },
        } = page;

        const article = <article>
            <header className={styles.header}>
                <MDXHeader
                    textStyle={'sans'}
                    title={title}
                    subtitle={subtitle}
                    createdTime={createdTime}
                />
            </header>
            <main className={styles.main}>
                <MDXBody textStyle={'sans'} code={code}/>
            </main>
        </article>;

        return <Main title={page.title} sections={article}/>
    }
}

export default Page

export const pageQuery = graphql`
    query PageQuery($pageId: String!) {
        config: configYaml {
            site {
                lang
            }
        }
        page(id: {eq: $pageId}) {
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
