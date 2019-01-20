import React from 'react'

class PostListLayout extends React.Component {
    render() {
        const { children } = this.props;

        return (<div>
            {children}
        </div>);
    }
}

export default PostListLayout
