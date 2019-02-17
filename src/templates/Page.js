import React from "react";
import styles from './Post.module.scss';

import { graphql } from 'gatsby';

import Main from '../components/Main'
import PageTitle from '../components/PageTitle';
import MDXMetadata from '../components/MDXMetadata'
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
                <PageTitle
                    textStyle={'sans'}
                    title={title}
                    subtitle={subtitle}
                />
                <aside className={styles.metadata}>
                    <MDXMetadata items={[
                        {name: 'time', data: createdTime},
                    ]} />
                </aside>
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
