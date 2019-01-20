import React from 'react'

class TagListLayout extends React.Component {
    render() {
        const { children } = this.props;

        return <div>
            {children}
        </div>
    }
}

export default TagListLayout
