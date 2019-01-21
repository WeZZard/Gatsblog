import React from 'react'
import Main from '../components/Main'
import ContentTitle from "../components/ContentTitle";
import Paginator from "../components/Paginator";

import PostListLayout from '../components/PostListLayout';
import TagListLayout from '../components/TagListLayout';
import PostExcerpt from '../components/PostExcerpt';
import TagSummary from '../components/TagSummary';

class Index extends React.Component {
    _getItem(itemName) {
        switch (itemName) {
            case `PostExcerpt`:
                return PostExcerpt;
            case `TagSummary`:
                return TagSummary;
            default:
                throw `Unknown item name: "${itemName}".`;
        }
    }

    _getLayout(layoutName) {
        switch (layoutName) {
            case `PostListLayout`:
                return PostListLayout;
            case `TagListLayout`:
                return TagListLayout;
            default:
                throw `Unknown layout name: "${layoutName}".`;
        }
    }

    render() {
        const { pageContext } = this.props;
        const { itemName, layoutName, items, paginationInfo, pageTitle, subtitle, showsPageTitle, description, keywords} = pageContext;

        const Item = this._getItem(itemName);
        const Layout = this._getLayout(layoutName);

        const itemComponents = items.map((item, itemIndex) => React.createElement(Item, {item: item, key: `${itemIndex}`}));
        const layoutComponent = React.createElement(Layout, {children: itemComponents});

        return <Main pageTitle={pageTitle} description={description} keywords={keywords}>
            <ContentTitle title={pageTitle} subtitle={subtitle} showsPageTitle={showsPageTitle}/>
            {layoutComponent}
            <Paginator paginationInfo={paginationInfo}/>
        </Main>;
    }
}

export default Index
