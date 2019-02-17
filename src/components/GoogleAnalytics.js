import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

const GoogleAnalytics = () => {
    return (
        <StaticQuery
            query={componentQuery}
            render={data => {

                const {
                    config: {
                        GoogleAnalytics
                    },
                } = data;

                if (GoogleAnalytics.trackingID) {
                    return (
                        <Helmet>
                            <script>
                                {`
                                window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                                ga('create', '${GoogleAnalytics.trackingID}', 'auto');
                                ga('send', 'pageview');
                                `}
                            </script>
                            <script async src='https://www.google-analytics.com/analytics.js'/>
                        </Helmet>
                    )
                } else {
                    return null;
                }
            }}
        />
    )
};

export default GoogleAnalytics

const componentQuery = graphql`
    query GoogleAnalyticsQuery {
        config: configYaml {
            GoogleAnalytics {
                trackingID
            }
        }
    }
`;
