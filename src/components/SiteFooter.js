import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import styles from './SiteFooter.module.scss'

class Slogan extends React.Component {
    render() {
        const { message } = this.props;

        return (
            <span
                className={styles.slogan}
                dangerouslySetInnerHTML= {{ __html: message}}
            />
        )
    }
}

class SiteFooter extends React.Component {
    render() {
        const messages=(
            <StaticQuery
                query={siteFooterMessagesQuery}
                render={data => {
                    const {
                        configYaml: {
                            site: {
                                owner: siteOwner,
                                slogans,
                            },
                        },
                    } = data;
                    const sloganComponents = slogans.map((footerMessage) => (
                        <Slogan key={footerMessage} message={footerMessage} />
                    ));

                    return <React.Fragment>
                        {sloganComponents}
                        <span key="copyright" className={styles.copyright}>
                                {`© ${new Date().getFullYear()} ${siteOwner} All Copyright Reserved.`}
                        </span>
                    </React.Fragment>
                }}
            />
        );

        return (
            <div className={styles.siteFooter}>
                {messages}
            </div>
        )
    }
}

export default SiteFooter

const siteFooterMessagesQuery=graphql`
    query SiteFooterMessagesQuery {
        configYaml {
            site {
                owner
                slogans
            }
        }
    }
`;