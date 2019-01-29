import React from "react"
import Main from '../components/Main'
import PostFullText from '../components/PostFullText'

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

        return <Main>
            <PostFullText post={post}/>
        </Main>
    }
}

export default Post
