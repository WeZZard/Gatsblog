import React from 'react'
import styles from './PageInfo.module.scss'

import { graphql, StaticQuery } from 'gatsby';

export default () => <StaticQuery
    query={componentQuery}
    render={({config: { site: { footerMessages }}}) => {
        return <div className={styles.pageInfo}>
            {
                footerMessages.map((message, index) => (
                    <div key={`${index}`} className={styles.pageInfoItem}>
                <span
                    className={styles.pageInfoContent}
                    dangerouslySetInnerHTML= {{ __html: message}}
                />
                    </div>
                ))
            }
            <div className={styles.pageInfoItem}>
                <span className={styles.pageInfoContent}>
                    Built with <a href="https://www.gatsbyjs.org">Gatsby.js</a>.
                </span>
            </div>
        </div>
    }}
/>;

const componentQuery = graphql`
    query MainQuery {
        config: configYaml {
            site {
                footerMessages
            }
        }
    }
`;
