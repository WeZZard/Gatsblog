import React from 'react'

class PageContent extends React.Component {
    render() {
        const { children } = this.props;

        return <div>
            {children}
        </div>
    }
}

export default PageContent
