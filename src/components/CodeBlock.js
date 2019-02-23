import React from 'react';
import styles from './CodeBlock.module.scss';

import Highlight, { defaultProps } from 'prism-react-renderer';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

export default ({ codeString, language, ...props }) => {
  if (props['react-live']) {
    return (
      <div className={styles.liveCode}>
        <LiveProvider code={codeString} mountStylesheet={false}>
          <LiveEditor />
          <LiveError />
          <LivePreview />
        </LiveProvider>
      </div>
    );
  } else {
    defaultProps.theme = theme;

    const path = props['path'];

    const version = props['version'];

    const pathLabel = path ? (
      <div className={styles.pathLabel}>
        <span>{path}</span>
      </div>
    ) : null;

    const languageClassName = language ? getLanguageClassName(language) : null;

    const languageString = [language, version].filter(_ => _).join(' ');

    const languageLabel = language ? (
      <div className={styles[languageClassName] || styles.languageLabel}>
        <span>{languageString}</span>
      </div>
    ) : null;

    return (
      <Highlight {...defaultProps} code={codeString} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => {
          return (
            <pre className={styles.preFormattedCodeBlock} style={style}>
              {pathLabel}
              {languageLabel}
              <code
                className={
                  language
                    ? styles.languageSpecifiedCode
                    : styles.languageUnspecifiedCode
                }
              >
                <div aria-hidden={'true'} className={styles.lineNumberList}>
                  {tokens.map((_, lineNumber) => (
                    <div
                      aria-hidden={'true'}
                      key={lineNumber}
                      className={styles.lineNumber}
                    />
                  ))}
                </div>
                <div className={styles.codeContent}>
                  {tokens.map((line, lineNumber) => (
                    <div
                      {...getLineProps({ line })}
                      key={lineNumber}
                      className={styles.line}
                    >
                      {line.map((token, key) => (
                        <span
                          {...getTokenProps({ token })}
                          key={key}
                          className={styles.token}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </code>
            </pre>
          );
        }}
      </Highlight>
    );
  }
};

const getLanguageClassName = language => {
  if (/^objective-c$/i.test(language)) {
    return 'objectiveC';
  }
  if (/^objective-c\+\+$/i.test(language)) {
    return 'objectiveCPP';
  }
  if (/^c\+\+$/i.test(language)) {
    return 'cPP';
  }
  if (/^\/etc\/hosts$/.test(language)) {
    return 'etcHosts';
  }
  if (/^pseudo-code$/.test(language)) {
    return 'pseudoCode';
  }
  if (/^js$/.test(language)) {
    return 'javaScript';
  }
  if (/^ts$/.test(language)) {
    return 'typeScript';
  }
  if (/^graphql$/.test(language)) {
    return 'graphQL';
  }
  if (/^latex$/.test(language)) {
    return 'laTex';
  }
  if (/^sass$/.test(language)) {
    return 'scss';
  }
  return language.toLowerCase();
};

const basic = [
  {
    types: ['builtin'],
    style: {
      color: '#3900A0',
    },
  },
  {
    types: ['function'],
    style: {
      color: '#245256',
    },
  },
  {
    types: ['function-name'],
    style: {
      color: '#245256',
    },
  },
  {
    types: ['operator'],
    style: {
      color: '#245256',
    },
  },
  {
    types: ['punctuation'],
    style: {
      color: '#575757',
    },
  },
  {
    types: ['keyword'],
    style: {
      color: '#9B2393',
      fontWeight: '500',
    },
  },
  {
    types: ['string'],
    style: {
      color: '#C41A16',
    },
  },
  {
    types: ['regex'],
    style: {
      color: '#C41A16',
    },
  },
  {
    types: ['char'],
    style: {
      color: '#1C00CF',
    },
  },
  {
    types: ['number'],
    style: {
      color: '#1C00CF',
    },
  },
  {
    types: ['entity'],
    style: {
      color: '#C41A16',
    },
  },
  {
    types: ['symbol'],
    style: {
      color: '#C41A16',
    },
  },
  {
    types: ['boolean'],
    style: {
      color: '#9B2393',
    },
  },
  {
    types: ['class-name'],
    style: {
      color: '#326D74',
    },
  },
  {
    types: ['constant'],
    style: {
      color: '#245256',
    },
  },
  {
    types: ['variable'],
    style: {
      color: '#326D74',
    },
  },
  {
    types: ['property'],
    style: {
      color: '#326D74',
    },
  },
  {
    types: ['comment'],
    style: {
      color: '#536579',
      fontStyle: 'italic',
    },
  },
];

const css = [
  {
    types: ['doctype'],
    style: {
      color: '#C41A16',
    },
  },
  {
    types: ['cdata'],
    style: {
      color: '#C41A16',
    },
  },
  {
    types: ['tag'],
    style: {
      color: '#326D74',
    },
  },
  {
    types: ['selector'],
    style: {
      color: '#326D74',
    },
  },
  {
    types: ['attr-name'],
    style: {
      color: '#5C2699',
    },
  },
  {
    types: ['attr-value'],
    style: {
      color: '#3900A0',
    },
  },
  {
    types: ['atrule'],
    style: {
      color: '#C41A16',
    },
  },
  {
    types: ['important'],
    style: {
      color: '#C41A16',
    },
  },
];

const diff = [
  {
    types: ['inserted'],
    style: {
      color: 'rgb(80, 250, 123)',
    },
  },
  {
    types: ['deleted'],
    style: {
      color: 'rgb(255, 85, 85)',
    },
  },
  {
    types: ['changed'],
    style: {
      color: 'rgb(255, 184, 108)',
    },
  },
];

var theme = {
  styles: [
    {
      types: ['prolog'],
      style: {
        color: 'rgb(189, 147, 249)',
      },
    },

    ...diff,
    ...basic,
    ...css,

    {
      types: ['url'],
      style: {
        color: '#815F03',
      },
    },
  ],
};
