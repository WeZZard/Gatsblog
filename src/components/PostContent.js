import React from 'react'

class PostContent extends React.Component {
    render() {
        const { children } = this.props;

        return <div>
            {children}
        </div>
    }
}

export default PostContent
