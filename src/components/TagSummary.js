import React from 'react'

class TagSummary extends React.Component {
    render() {
        const { children } = this.props;

        return <div>
            {children}
        </div>
    }
}

export default TagSummary
