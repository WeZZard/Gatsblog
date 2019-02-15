import assert from 'assert'
import React from 'react'
import styles from './Heading.module.scss'
import _ from "lodash"

class Heading extends React.Component {
    render() {
        const {
            level,
            children
        } = this.props;
        assert(level >= 1 && level <= 6);

        const name = `${_.kebabCase(children)}`;
        const Component = `h${level}`;

        return <Component id={name} className={styles.h}>
            <span className={styles[`h${level}`]} children={children}/>
        </Component>
    }
}

export default Heading
