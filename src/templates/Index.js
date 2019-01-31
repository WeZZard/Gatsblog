import React from 'react'
import Main from '../components/Main'
import ContentTitle from "../components/ContentTitle";
import Paginator from "../components/Paginator";

import PostListLayout from '../components/PostListLayout';
import TagListLayout from '../components/TagListLayout';
import PostExcerpt from '../components/PostExcerpt';
import TagSummary from '../components/TagSummary';

class Index extends React.Component {
    static _getItemComponentByName(itemComponentName) {
        switch (itemComponentName) {
            case `PostExcerpt`:
                return PostExcerpt;
            case `TagSummary`:
                return TagSummary;
            default:
                throw `Unknown item component name: "${itemComponentName}".`;
        }
    }

    static _getLayoutComponentByName(layoutComponentName) {
        switch (layoutComponentName) {
            case `PostListLayout`:
                return PostListLayout;
            case `TagListLayout`:
                return TagListLayout;
            default:
                throw `Unknown layout component name: "${layoutComponentName}".`;
        }
    }

    render() {
        const { pageContext } = this.props;
        const {
            slug,
            itemComponentName,
            layoutComponentName,
            items,
            paginationInfo,
            pageTitle,
            subtitle,
            showsPageTitle,
            description,
            keywords
        } = pageContext;

        const Item = Index._getItemComponentByName(itemComponentName);
        const Layout = Index._getLayoutComponentByName(layoutComponentName);

        const itemComponents = items.map((item, itemIndex) =>
            React.createElement(Item, {item: item, key: `${itemIndex}`})
        );
        const layoutComponent = React.createElement(
            Layout,
            {children: itemComponents}
            );

        const contentTitle = showsPageTitle
            ? <ContentTitle title={pageTitle} subtitle={subtitle}/>
            : null;

        return <Main
            pageTitle={pageTitle}
            description={description}
            keywords={keywords}
            selectedNavigationItem={{slug: slug}}
        >
            {contentTitle}
            {layoutComponent}
            <Paginator paginationInfo={paginationInfo}/>
        </Main>
    }
}

export default Index
