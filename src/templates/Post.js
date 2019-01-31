import React from "react"
import Main from '../components/Main'
import PostFullText from '../components/PostFullText'
import MorePosts from '../components/MorePosts'

class Post extends React.Component {
    render() {
        const { pageContext } = this.props;
        const {
            isLocalized,
            lang,
            post,
            earlier,
            later,
            tableOfContents,
            defaultLicense,
        } = pageContext;

        const morePostsComponent = (earlier || later)
            ? <MorePosts earlier={earlier} later={later}/>
            : null;

        return <Main tableOfContents={tableOfContents}>
            <PostFullText post={post} defaultLicense={defaultLicense}/>
            {morePostsComponent}
        </Main>
    }
}

export default Post
