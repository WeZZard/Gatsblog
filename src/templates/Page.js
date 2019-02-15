import React from "react";

import { graphql } from 'gatsby';

import Main from '../components/Main'
import PageHeader from '../components/PageHeader';
import MDXBody from '../components/MDXBody'

class Page extends React.Component {
    render() {
        const { data } = this.props;
        const { page } = data;

        const article = <article>
            <PageHeader
                title={page.title}
                subtitle={page.subtitle}
                createdTime={page.createdTime}
            />
            <MDXBody mdx={page.file} textStyle={'sans'}/>
        </article>;

        return <Main
            title={page.title}
            contents={[article]}
        />
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
