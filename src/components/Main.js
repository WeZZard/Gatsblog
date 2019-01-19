import React from 'react'
import styles from './Main.module.scss'

import NavigationBar from './NavigationBar'
import ContentFooter from './ContentFooter'
import SiteFooter from './SiteFooter'

class Main extends React.Component {
    render() {
        const { navigationStack, children } = this.props;

        return (
            <div className={styles.appContainer}>
                <section className={styles.controlWrapper}>
                    <header className={styles.headerContentContainer}>
                        <NavigationBar navigationStack={navigationStack} />
                    </header>
                    <SiteFooter/>
                </section>
                <section className={styles.contentWrapper}>
                    <main className={styles.mainContentContainer}>
                        {children}
                    </main>
                    <footer className={styles.footerContentContainer}>
                        <ContentFooter />
                    </footer>
                </section>
            </div>
        )
    }
}

export default Main
