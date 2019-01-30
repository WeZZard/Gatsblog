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
        } = pageContext;

        const morePostsComponent = (earlier || later)
            ? <MorePosts earlier={earlier} later={later}/>
            : null;

        return <Main>
            <PostFullText post={post}/>
            {morePostsComponent}
        </Main>
    }
}

export default Post
