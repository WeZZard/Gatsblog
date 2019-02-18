import React from 'react'
import styles from './Main.module.scss'

import Viewport from './Viewport'
import SEO from './SEO'
import GoogleAnalytics from './GoogleAnalytics'
import Navigation from './Navigation'
import SiteFooter from './SiteFooter'
import PageInfo from './PageInfo'
import ContentSeparator from './ContentSeparator'
import { normalizeChildren } from '../utils';

export default (
    {
        slug,
        lang,
        title,
        description,
        keywords,
        headings,
        sections,
    }
    ) => {
    const normalizedSections = normalizeChildren(sections);

    const numberOfContents = normalizedSections.length;

    const children = normalizedSections
        .map((content, index) =>
            <React.Fragment key={index}>
                <div className={styles.section}>
                    {content}
                </div>
                {index + 1 < numberOfContents ? <ContentSeparator key={`${index}-separator`}/> : null}
            </React.Fragment>
        );

    return <React.Fragment>
        <Viewport/>
        <GoogleAnalytics/>
        <SEO
            lang={lang}
            title={title}
            description={description}
            keywords={keywords}
        />
        <div className={styles.main}>
            <Navigation slug={slug} headings={headings}/>
            <div className={styles.contents}>
                {children}
                <ContentSeparator/>
                <footer className={styles.section}>
                    <PageInfo/>
                </footer>
            </div>
            <SiteFooter/>
        </div>
    </React.Fragment>
}
