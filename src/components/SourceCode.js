import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import dracula from 'prism-react-renderer/themes/dracula';
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
        defaultProps.theme = dracula;
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

export default SourceCode;
