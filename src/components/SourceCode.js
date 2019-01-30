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

export default SourceCode;
