import assert from 'assert'
import React from 'react'
import styles from './Heading.module.scss'
import _ from "lodash"

const getStyleForLevel = (level) => {
    switch (level) {
        case 1: return styles.h1;
        case 2: return styles.h2;
        case 3: return styles.h3;
        case 4: return styles.h4;
        case 5: return styles.h5;
        case 6: return styles.h6;
        default: throw `Invalid level of heading: ${level}.`
    }
};

const getGlobalStyleForLevel = (level) => {
    switch (level) {
        case 1: return 'h1';
        case 2: return 'h2';
        case 3: return 'h3';
        case 4: return 'h4';
        case 5: return 'h5';
        case 6: return 'h6';
        default: throw `Invalid level of heading: ${level}.`
    }
};

const getHeadingForLevel = (level) => {
    return `h${level}`;
};

class Heading extends React.Component {
    render() {
        const { level, children } = this.props;
        assert(level >= 1 && level <= 6);

        const name = `${_.kebabCase(children)}`;
        const H = getHeadingForLevel(level);
        const style = getStyleForLevel(level);
        const globalStyle = getGlobalStyleForLevel(level);
        const headingStyles = ['heading', globalStyle, style].join(' ');

        return <H id={name} className={headingStyles} children={children}/>
    }
}

export default Heading
