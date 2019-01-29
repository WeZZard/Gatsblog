import React from 'react'

class PostFullText extends React.Component {
    render() {
        const { post } = this.props;
        const {
            title,
            subtitle,
            createdTime,
            tags,
            categories,
            html,
            code,
            excerpt
        } = post;

        console.log('html: ', html);
        console.log('code: ', code);
        console.log('excerpt: ', excerpt);


        return <div>
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
        </div>
    }
}

export default PostFullText
