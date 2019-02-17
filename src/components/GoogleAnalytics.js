import React from 'react'
import Helmet from 'react-helmet'

export default () => {
    if (process.env.GATSBY_GA_TRACKING_ID) {
        return (
            <Helmet>
                <script>
                    {
`window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', '${process.env.GATSBY_GA_TRACKING_ID}', 'auto');
ga('send', 'pageview');`
}
                </script>
                <script async src='https://www.google-analytics.com/analytics.js'/>
            </Helmet>
        )
    } else {
        return null;
    }
}
