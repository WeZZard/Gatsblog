import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import styles from './ContentFooter.module.scss'

class ContentFooterItem extends React.Component {
    render() {
        const { message } = this.props;

        return (
            <div className={styles.contentFooterItem}>
                <span
                    dangerouslySetInnerHTML= {{ __html: message}}
                />
            </div>
        )
    }
}

class ContentFooter extends React.Component {
    render() {
        const customFooterMessages=(
            <StaticQuery
                query={_contentFooterMessagesQuery}
                render={data => {
                    const footerMessages = data.configYaml.site.footerMessages;
                    return footerMessages.map((footerMessage, index) => (
                        <ContentFooterItem key={`${index}`} message={footerMessage} />
                    ))
                }}
            />
        );

        return (
            <div className={styles.contentFooter}>
                {customFooterMessages}
                <ContentFooterItem
                    message={
                        'Built with <a href="https://www.gatsbyjs.org">Gatsby.js</a>.'
                    }
                />
            </div>
        )
    }
}

export default ContentFooter

const _contentFooterMessagesQuery=graphql`
    query ContentFooterMessagesQuery {
        configYaml {
            site {
                footerMessages
            }
        }
    }
`;