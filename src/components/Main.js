import React from 'react'
import styles from './Main.module.scss'

import NavigationBar from './NavigationBar'
import ContentFooter from './ContentFooter'
import SiteFooter from './SiteFooter'
import ContentSeparator from './ContentSeparator'
import SEO from './SEO'

class Main extends React.Component {
    render() {
        const { navigationStack, lang, pageTitle, description, keywords, children } = this.props;

        return (
            <div className={styles.appContainer}>
                <SEO lang={lang} title={pageTitle} description={description} keywords={keywords}/>
                <section className={styles.controlWrapper}>
                    <header className={styles.navigationContainer}>
                        <NavigationBar navigationStack={navigationStack}/>
                    </header>
                    <footer className={styles.siteFooterContainer}>
                        <SiteFooter/>
                    </footer>
                    <div className={styles.controlWrapperOverlay}/>
                </section>
                <section className={styles.contentWrapper}>
                    <main className={styles.mainContentContainer}>
                        {children}
                    </main>
                    <ContentSeparator/>
                    <footer className={styles.footerContentContainer}>
                        <ContentFooter />
                    </footer>
                </section>
            </div>
        )
    }
}

export default Main
