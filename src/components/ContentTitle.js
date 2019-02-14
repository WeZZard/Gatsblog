import React from 'react'

class ContentTitle extends React.Component {
    render() {
        const { title, subtitle } = this.props;

        const subtitleComponent = subtitle ? <h2>{subtitle}</h2> : null;

        return <React.Fragment>
            <h1>{title}</h1>
            {subtitleComponent}
        </React.Fragment>
    }
}

export default ContentTitle
