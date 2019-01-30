import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import styles from './SourceCode.module.scss'

const SourceCode = ({ codeString, language, ...props }) => {
    const safeCoreString = codeString.replace(/\n/, '\n');
    if (props['react-live']) {
        return (
            <LiveProvider code={safeCoreString} noInline={true}>
                <LiveEditor />
                <LiveError />
                <LivePreview />
            </LiveProvider>
        );
    } else {
        defaultProps.theme = theme;
        return (
            <Highlight {...defaultProps} code={safeCoreString} language={language}>
                {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                }) => (
                    <pre className={[className, styles.sourceCode].join(" ")} style={style}>
                        <div aria-hidden={'true'} className={styles.lineNumberList}>
                            {tokens.map((_, lineNumber) => (
                                <div aria-hidden={'true'} key={lineNumber} className={styles.lineNumber}/>
                            ))}
                        </div>
                        <div className={styles.codeContent}>
                            {tokens.map((line, lineNumber) => (
                                <div {...getLineProps({ line, key: lineNumber })} className={styles.line}>
                                    {line.map((token, key) => (
                                        <span {...getTokenProps({ token, key })} className={styles.token} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </pre>
                )}
            </Highlight>
        );
    }
};

var theme = {
    styles: [
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
        {
            types: ["prolog"],
            style: {
                color: "rgb(189, 147, 249)"
            }
        },
        {
            types: ["constant"],
            style: {
                color: "#245256"
            }
        },
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
            types: ["punctuation"],
            style: {
                color: "#575757"
            }
        },
        {
            types: ["symbol"],
            style: {
                color: "#643820"
            }
        },
        {
            types: ["string", "char"],
            style: {
                color: "#C41A16"
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
            types: ["keyword"],
            style: {
                color: "#9B2393",
                fontWeight: "500"
            }
        },
        {
            types: ["variable"],
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
        {
            types: ["attr-name"],
            style: {
                color: "#815F03"
            }
        }
    ]
};

export default SourceCode;
