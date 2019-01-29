import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import styles from './SiteFooter.module.scss'

class Slogan extends React.Component {
    render() {
        const { message } = this.props;

        return (
            <div className={styles.sloganItem}>
                <span
                    className={styles.slogan}
                    dangerouslySetInnerHTML= {{ __html: message}}
                />
            </div>
        )
    }
}

class SiteFooter extends React.Component {
    render() {
        const customFooterMessages=(
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
                        <div key="copyright" className={styles.copyrightItem}>
                            <span>
                                {`© ${new Date().getFullYear()} ${siteOwner} All Copyright Reserved.`}
                            </span>
                        </div>
                    </React.Fragment>
                }}
            />
        );

        return (
            <div className={styles.siteFooter}>
                {customFooterMessages}
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