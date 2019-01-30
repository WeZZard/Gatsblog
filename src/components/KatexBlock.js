import React from 'react'
import styles from './KatextBlock.module.scss'

class KatextBlock extends React.Component {
    render() {
        const props = this.props;

        return <div className={styles.KatextBlock} {...props}/>
    }
}

export default KatextBlock
