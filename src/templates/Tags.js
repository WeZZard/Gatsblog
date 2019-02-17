import React from 'react'
import styles from './Tags.module.scss'

import Main from '../components/Main'
import ContentTitle from "../components/ContentTitle";
import Paginator from "../components/Paginator";
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

        const components = taxonomies
            .sort((t1, t2) => t1 > t2)
            .map((tag, index) =>
                <div key={index} className={styles.tagSummary}>
                    {
                        React.createElement(
                            TagSummary,
                            {
                                tag,
                                baseSlug: slug,
                                posts,
                            }
                        )
                    }
                </div>
            );

        const header = showsPageTitle
            ? <header><ContentTitle title={title} subtitle={subtitle}/></header>
            : null;

        const contents = <React.Fragment>
            {header}
            <main>{components}</main>
            <div className={styles.paginator}>
                <Paginator paginationInfo={paginationInfo}/>
            </div>
        </React.Fragment>;

        return <Main
            slug={slug}
            title={title}
            description={description}
            keywords={keywords}
            contents={[contents]}
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
