import React from 'react';
import styles from './CodeBlock.module.scss'
import { edgesWithGridSystem } from '../utils'

import Highlight, { defaultProps } from 'prism-react-renderer';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

export default ({ codeString, language, ...props }) => {
    if (props['react-live']) {
        const className = edgesWithGridSystem({
            top: 'rect',
            bottom: 'rect',
        });

        return (
            <LiveProvider className={className} code={codeString} noInline={true}>
                <LiveEditor />
                <LiveError />
                <LivePreview />
            </LiveProvider>
        );
    } else {
        defaultProps.theme = theme;

        const path = props['path'];

        const version = props['version'];

        const pathLabel = path
            ? <div className={styles.pathLabel}><span>{path}</span></div>
            : null;

        const languageLabel = language
            ? <LanguageLabel language={language} version={version}/>
            : null;

        return <Highlight {...defaultProps} code={codeString} language={language}>
            {
                ({ style, tokens, getLineProps, getTokenProps }) => {
                    const className = edgesWithGridSystem({
                        style: styles.preFormattedCodeBlock,
                        top: 'rect',
                        bottom: 'rect',
                    });
                    return <pre className={className} style={style}>
                        {pathLabel}
                        {languageLabel}
                        <code className={language ? styles.languageSpecifiedCode : styles.languageUnspecifiedCode}>
                            <Code
                                tokens={tokens}
                                getLineProps={getLineProps}
                                getTokenProps={getTokenProps}
                            />
                        </code>
                    </pre>
                }
            }
        </Highlight>
    }
};

class LanguageLabel extends React.Component {
    render() {
        const { language, version } = this.props;

        const className = styles[LanguageLabel.getLanguageClassName(language)] || styles.languageLabel;

        const contents = [language, version].filter(_ => _).join(' ');

        return <div className={className}>
            <span>{contents}</span>
        </div>
    }

    static getLanguageClassName (language) {
        if (/^objective-c$/i.test(language )) {
            return 'objectiveC';
        }
        if (/^objective-c\+\+$/i.test(language )) {
            return 'objectiveCPP';
        }
        if (/^c\+\+$/i.test(language )) {
            return 'cPP';
        }
        if (/^\/etc\/hosts$/.test(language )) {
            return 'etcHosts';
        }
        if (/^pseudo-code$/.test(language )) {
            return 'pseudoCode';
        }
        if (/^js$/.test(language )) {
            return 'javaScript';
        }
        if (/^ts$/.test(language )) {
            return 'typeScript';
        }
        if (/^graphql$/.test(language )) {
            return 'graphQL';
        }
        if (/^latex$/.test(language )) {
            return 'laTex';
        }
        if (/^sass$/.test(language )) {
            return 'scss';
        }
        return language.toLowerCase();
    };
}

const Code = ({ tokens, getLineProps, getTokenProps }) => {
    return <React.Fragment>
        <div aria-hidden={'true'} className={styles.lineNumberList}>
            {tokens.map((_, lineNumber) => (
                <div aria-hidden={'true'} key={lineNumber} className={styles.lineNumber}/>))}
        </div>
        <div className={styles.codeContent}>
            {tokens.map((line, lineNumber) => (
                <div {...getLineProps({ line, key: lineNumber })} className={styles.line}>
                    {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} className={styles.token} />))}
                </div>
            ))}
        </div>
    </React.Fragment>
};

const basic =  [
    {
        types: ["builtin"],
        style: {
            color: "#3900A0"
        }
    },
    {
        types: ["function"],
        style: {
            color: "#245256"
        }
    },
    {
        types: ["function-name"],
        style: {
            color: "#245256"
        }
    },
    {
        types: ["operator"],
        style: {
            color: "#245256",
        }
    },
    {
        types: ["punctuation"],
        style: {
            color: "#575757"
        }
    },
    {
        types: ["keyword"],
        style: {
            color: "#9B2393",
            fontWeight: "500"
        }
    },
    {
        types: ["string"],
        style: {
            color: "#C41A16"
        }
    },
    {
        types: ["regex"],
        style: {
            color: "#C41A16"
        }
    },
    {
        types: ["char"],
        style: {
            color: "#1C00CF"
        }
    },
    {
        types: ["number"],
        style: {
            color: "#1C00CF"
        }
    },
    {
        types: ["entity"],
        style: {
            color: "#C41A16"
        }
    },
    {
        types: ["symbol"],
        style: {
            color: "#C41A16"
        }
    },
    {
        types: ["boolean"],
        style: {
            color: "#9B2393"
        }
    },
    {
        types: ["class-name"],
        style: {
            color: "#326D74"
        }
    },
    {
        types: ["constant"],
        style: {
            color: "#245256"
        }
    },
    {
        types: ["variable"],
        style: {
            color: "#326D74"
        }
    },
    {
        types: ["property"],
        style: {
            color: "#326D74"
        }
    },
    {
        types: ["comment"],
        style: {
            color: "#536579",
            fontStyle: "italic"
        }
    },
];

const css = [
    {
        types: ["doctype"],
        style: {
            color: "#C41A16",
        }
    },
    {
        types: ["cdata"],
        style: {
            color: "#C41A16",
        }
    },
    {
        types: ["tag"],
        style: {
            color: "#326D74"
        }
    },
    {
        types: ["selector"],
        style: {
            color: "#326D74"
        }
    },
    {
        types: ["attr-name"],
        style: {
            color: "#5C2699"
        }
    },
    {
        types: ["attr-value"],
        style: {
            color: "#3900A0"
        }
    },
    {
        types: ["atrule"],
        style: {
            color: "#C41A16"
        }
    },
    {
        types: ["important"],
        style: {
            color: "#C41A16"
        }
    },
];

const diff = [
    {
        types: ["inserted"],
        style: {
            color: "rgb(80, 250, 123)"
        }
    },
    {
        types: ["deleted"],
        style: {
            color: "rgb(255, 85, 85)"
        }
    },
    {
        types: ["changed"],
        style: {
            color: "rgb(255, 184, 108)"
        }
    },
];

var theme = {
    styles: [
        {
            types: ["prolog"],
            style: {
                color: "rgb(189, 147, 249)"
            }
        },

        ...diff,
        ...basic,
        ...css,

        {
            types: ["url"],
            style: {
                color: "#815F03"
            }
        },
    ]
};
