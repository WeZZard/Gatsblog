import React from 'react'

class Paginator extends React.Component {
    render() {
        const { children } = this.props;

        return <div>
            {children}
        </div>
    }
}

export default Paginator
