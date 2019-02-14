import React from 'react'
import Main from '../components/Main'
import ContentTitle from "../components/ContentTitle";
import Paginator from "../components/Paginator";

import ListLayout from '../components/ListLayout';
import TagSummary from '../components/TagSummary';
import { graphql } from 'gatsby';

class Tags extends React.Component {
    render() {
        const { data, pageContext } = this.props;
        const {
            slug,
            taxonomies,
            paginationInfo,
            title,
            subtitle,
            showsPageTitle,
            description,
            keywords
        } = pageContext;

        const {
            allPost: {
                edges: postNodes
            }
        } = data;

        const posts = postNodes.map(postNode => postNode.node);

        const components = taxonomies.map((tag, index) =>
            React.createElement(
                TagSummary,
                {
                    tag,
                    baseSlug: slug,
                    posts,
                    key: index
                }
            )
        );

        const header = showsPageTitle
            ? <ContentTitle title={title} subtitle={subtitle}/>
            : null;

        const main = <React.Fragment>
            <ListLayout>
                {components}
            </ListLayout>
            <Paginator paginationInfo={paginationInfo}/>
        </React.Fragment>;

        return <Main
            slug={slug}
            title={title}
            description={description}
            keywords={keywords}
            header={header}
            main={main}
        />
    }
}

export default Tags

export const pageQuery = graphql`
    query TagsQuery($taxonomies: [String!]!) {
        allPost(filter: {tags: {in: $taxonomies}}) {
            edges {
                node {
                    slug
                    title
                    subtitle
                    isPublished
                    createdTime
                    tags
                }
            }
        }
    }
`;
