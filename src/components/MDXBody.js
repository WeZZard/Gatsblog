import React from 'react';
import PropTypes from 'prop-types';

import { MDXProvider } from '@mdx-js/react';
import MDXContext from './MDXContext';
import Heading from './Heading';
import Table from './Table';
import TableHeader from './TableHeader';
import TableData from './TableData';
import Image from './Image';
import Picture from './Picture';
import Paragraph from './Paragraph';
import List from './List';
import Blockquote from './Blockquote';
import SegmentSeparator from './SegmentSeparator';
import Checkbox from './Checkbox';
import Strong from './Strong';
import Footnotes from './Footnotes';
import Superscript from './Superscript';
import CodeBlock from './CodeBlock';
import InlineCode from './InlineCode';
import MathBlock from './MathBlock';
import InlineMath from './InlineMath';
import Anchor from './Anchor';
import Span from './Span';
import Figure from './Figure';
import FigureCaption from './FigureCaption';
import PreFormattedBlock from './PreFormattedBlock';
import Geometry from './Geometry';

import {
  pToImage,
  pToPicture,
  preToMathBlock,
  preToCodeBlock,
  pToFigure,
} from '../utils';

const h1 = props => <Heading level={1} {...props} />;
h1.displayName = 'h1';

const h2 = props => <Heading level={2} {...props} />;
h2.displayName = 'h2';

const h3 = props => <Heading level={3} {...props} />;
h3.displayName = 'h3';

const h4 = props => <Heading level={4} {...props} />;
h4.displayName = 'h4';

const h5 = props => <Heading level={5} {...props} />;
h5.displayName = 'h5';

const h6 = props => <Heading level={6} {...props} />;
h6.displayName = 'h6';

const p = props => {
  const image = pToImage(props);
  if (image) {
    return <Geometry {...props} />;
  }
  const picture = pToPicture(props);
  if (picture) {
    return <Geometry {...props} />;
  }
  const figure = pToFigure(props);
  if (figure) {
    return <Geometry {...props} />;
  }
  return <Paragraph {...props} />;
};
p.displayName = 'p';

const pre = props => {
  const codeBlock = preToCodeBlock(props);
  const mathBlock = preToMathBlock(props);
  if (codeBlock) {
    return <CodeBlock {...codeBlock} />;
  } else if (mathBlock) {
    return <MathBlock {...mathBlock} />;
  } else {
    return <PreFormattedBlock {...props} />;
  }
};
pre.displayName = 'pre';

const ol = props => <List type={'orderedList'} {...props} />;
ol.displayName = 'ol';

const ul = props => <List type={'unorderedList'} {...props} />;
ul.displayName = 'ul';

const input = props => {
  if (props.type && props.type === 'checkbox') {
    return <Checkbox {...props} />;
  }
  return <input {...props} />;
};
input.displayName = 'input';
input.propTypes = {
  type: PropTypes.string,
};

const div = props => {
  if (props.className === 'footnotes') {
    return <Footnotes {...props} />;
  }
  return <div {...props} />;
};
div.displayName = 'div';
div.propTypes = {
  className: PropTypes.string,
};

const components = {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  code: InlineCode,
  pre,
  strong: Strong,
  hr: SegmentSeparator,
  ol,
  ul,
  table: Table,
  th: TableHeader,
  td: TableData,
  blockquote: Blockquote,
  input,
  div,
  sup: Superscript,
  a: Anchor,
  span: Span,
  picture: Picture,
  img: Image,
  figure: Figure,
  figcaption: FigureCaption,
  InlineMath,
  MathBlock,
};

const MDXBody = ({ textStyle, children }) => (
  <MDXContext.Provider value={textStyle}>
    <MDXProvider components={components}>
      {children}
    </MDXProvider>
  </MDXContext.Provider>
);

MDXBody.propTypes = {
  children: PropTypes.node,
  textStyle: PropTypes.string.isRequired,
};

export default MDXBody;
