import React from 'react'

export default ({ titles }) => {
    return <div>
        {titles.map(title => <h1>{title}</h1>)}
    </div>
}
