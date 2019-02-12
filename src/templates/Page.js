import React from "react";
import Main from '../components/Main'
import { graphql } from 'gatsby';
import PageDocument from '../components/PageDocument';

class Page extends React.Component {
    render() {
        const { data } = this.props;
        const {
            page,
        } = data;

        return <Main selectedNavigationItem={{slug: page.slug}}>
            <PageDocument page={page}/>
        </Main>
    }
}

export default Page

export const pageQuery = graphql`
    query PageQuery($pageId: String!) {
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
