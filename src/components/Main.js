import React from 'react'
import styles from './Main.module.scss'

import SEO from './SEO'
import GoogleAnalytics from './GoogleAnalytics'
import Menu from './Menu'
import NavigationBar from './NavigationBar'
import TableOfContents from './TableOfContents'
import ContentSeparator from './ContentSeparator'
import { StaticQuery, graphql } from "gatsby"
import { normalizeChildren } from '../utils';

const SiteInfo = ({siteOwner, slogans}) => <div className={styles.siteInfo}>
    {slogans.map((slogan, index) =>
        <div key={index} className={styles.siteInfoItem}>
            <span
                className={styles.slogan}
                dangerouslySetInnerHTML= {{ __html: slogan}}
            />
        </div>
    )}
    <div className={styles.siteInfoItem}>
        <span className={styles.copyright}>
            © {new Date().getFullYear()} {siteOwner} All Copyright Reserved.
        </span>
    </div>
</div>;

const PageInfo = ({footerMessages}) => <div className={styles.pageInfo}>
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
</div>;

const componentQuery = graphql`
    query MainQuery {
        config: configYaml {
            site {
                title
                owner
                slogans
                footerMessages
            }
        }
    }
`;

export default (
    {
        slug,
        lang,
        title,
        description,
        keywords,
        tableOfContents,
        sections,
    }
    ) => <StaticQuery
    query={componentQuery}
    render={(
        {
            config: {
                site: {
                    title: siteTitle,
                    owner: siteOwner,
                    slogans,
                    footerMessages
                }
            }
        }) => {

        const hasTableOfContents = tableOfContents
            && tableOfContents.items
            && tableOfContents.items.length > 0;

        const tableOfContentsComponent = hasTableOfContents
            ? <div className={styles.tableOfContents}>
                <TableOfContents tableOfContents={tableOfContents}/>
            </div>
            : null;

        const normalizedSections = normalizeChildren(sections);

        const numberOfContents = normalizedSections.length;

        const children = normalizedSections
            .map((content, index) =>
                <React.Fragment key={index}>
                    {content}
                    {index + 1 < numberOfContents ? <ContentSeparator key={`${index}-separator`}/> : null}
                </React.Fragment>
            );

        return <div className={styles.app}>
            <GoogleAnalytics/>
            <SEO
                lang={lang}
                title={title}
                description={description}
                keywords={keywords}
            />
            <Menu/>
            <div className={styles.navigation}>
                <div className={styles.siteTitle}>
                    <label className={styles.siteTitleLabel}>{siteTitle}</label>
                </div>
                <div className={styles.navigationBar}>
                    <NavigationBar slug={slug}/>
                </div>
                {tableOfContentsComponent}
                <SiteInfo slogans={slogans} siteOwner={siteOwner}/>
                <div className={styles.navigationOverlay}/>
            </div>
            <div className={styles.content}>
                {children}
                <ContentSeparator/>
                <footer className={styles.footer}>
                    <PageInfo footerMessages={footerMessages}/>
                </footer>
            </div>
        </div>
    }}
/>
