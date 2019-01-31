import React from "react";
import Main from '../components/Main'

class Page extends React.Component {
    render() {
        const { pageContext } = this.props;
        const { slug } = pageContext;
        return <Main selectedNavigationItem={{slug: slug}}>
        </Main>
    }
}

export default Page
