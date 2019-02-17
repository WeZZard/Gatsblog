import React from 'react'
import styles from './Link.module.scss'

export default ({ kind, to: href, children, dangerouslySetInnerHTML }) =>
    <a
        className={styles[kind]}
        href={href}
        children={children}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
